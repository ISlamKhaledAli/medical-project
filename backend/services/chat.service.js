import Message from "../models/Message.model.js";
import Appointment from "../models/Appointments.model.js";
import DoctorProfile from "../models/Doctor.model.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";

/**
 * Get all conversations for the current user.
 * A conversation is derived from appointments between doctor ↔ patient.
 * Returns unique partner users with the last message preview.
 */
export const getMyConversations = async (userId, userRole) => {
    let appointments;

    if (userRole === "doctor") {
        const doctorProfile = await DoctorProfile.findOne({ user: userId });
        if (!doctorProfile) throw new ApiError("Doctor profile not found", 404);

        appointments = await Appointment.find({
            doctor: doctorProfile._id,
            status: { $in: ["confirmed", "completed"] },
        }).populate("patient", "fullName email");
    } else {
        appointments = await Appointment.find({
            patient: userId,
            status: { $in: ["confirmed", "completed"] },
        }).populate({
            path: "doctor",
            populate: { path: "user", select: "fullName email" },
        });
    }

    // Build unique partner map
    const partnerMap = new Map();

    for (const appt of appointments) {
        let partnerId, partnerName, partnerEmail;

        if (userRole === "doctor") {
            partnerId = appt.patient._id.toString();
            partnerName = appt.patient.fullName;
            partnerEmail = appt.patient.email;
        } else {
            partnerId = appt.doctor.user._id.toString();
            partnerName = appt.doctor.user.fullName;
            partnerEmail = appt.doctor.user.email;
        }

        if (!partnerMap.has(partnerId)) {
            partnerMap.set(partnerId, {
                partnerId,
                partnerName,
                partnerEmail,
                partnerRole: userRole === "doctor" ? "patient" : "doctor",
            });
        }
    }

    // Fetch last message + unread count for each conversation
    const conversations = [];

    for (const [partnerId, info] of partnerMap) {
        const conversationId = Message.getConversationId(userId, partnerId);

        const lastMessage = await Message.findOne({ conversation: conversationId })
            .sort({ createdAt: -1 })
            .lean();

        const unreadCount = await Message.countDocuments({
            conversation: conversationId,
            receiver: userId,
            isRead: false,
        });

        conversations.push({
            ...info,
            conversationId,
            lastMessage: lastMessage
                ? {
                      text: lastMessage.text,
                      createdAt: lastMessage.createdAt,
                      senderId: lastMessage.sender.toString(),
                  }
                : null,
            unreadCount,
        });
    }

    // Sort by last message time (most recent first)
    conversations.sort((a, b) => {
        const timeA = a.lastMessage?.createdAt || 0;
        const timeB = b.lastMessage?.createdAt || 0;
        return new Date(timeB) - new Date(timeA);
    });

    return conversations;
};

/**
 * Get messages for a specific conversation between current user and a partner.
 */
export const getConversation = async (userId, partnerId, page = 1, limit = 50) => {
    const conversationId = Message.getConversationId(userId, partnerId);

    const skip = (page - 1) * limit;
    const messages = await Message.find({ conversation: conversationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "fullName")
        .populate("receiver", "fullName")
        .lean();

    const total = await Message.countDocuments({ conversation: conversationId });

    return {
        messages: messages.reverse(), // Return chronological order
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};

/**
 * Send a message from sender to receiver.
 */
export const sendMessage = async (senderId, receiverId, text) => {
    if (!text || !text.trim()) {
        throw new ApiError("Message text is required", 400);
    }

    const conversationId = Message.getConversationId(senderId, receiverId);

    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        receiver: receiverId,
        text: text.trim(),
    });

    const populated = await Message.findById(message._id)
        .populate("sender", "fullName")
        .populate("receiver", "fullName")
        .lean();

    return populated;
};

/**
 * Mark all messages in a conversation as read for the current user.
 */
export const markConversationAsRead = async (userId, partnerId) => {
    const conversationId = Message.getConversationId(userId, partnerId);

    const result = await Message.updateMany(
        { conversation: conversationId, receiver: userId, isRead: false },
        { isRead: true }
    );

    return { modifiedCount: result.modifiedCount };
};
