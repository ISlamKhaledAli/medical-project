import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDoctorById } from "../../features/doctor/doctorSlice";
import {
  fetchDoctorAvailability,
  setSelectedDate,
  setSelectedSlot,
} from "../../features/availability/availabilitySlice";
import {
  createAppointment,
  resetBookingState,
} from "../../features/appointment/appointmentSlice";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { doctor } = useSelector(
    (state) => state.doctor
  );
  const {
    dates,
    selectedDate,
    selectedSlot,
  } = useSelector((state) => state.availability);

  const {
    bookingSuccess,
    isLoading,
  } = useSelector((state) => state.appointment);

  useEffect(() => {
    dispatch(fetchDoctorById(id));
    dispatch(fetchDoctorAvailability(id));
  }, [id]);

  useEffect(() => {
    if (bookingSuccess) {
      alert("Appointment booked successfully!");
      dispatch(resetBookingState());
    }
  }, [bookingSuccess]);

  if (!doctor) return <p>Loading...</p>;

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) {
      alert("Please select date and time slot");
      return;
    }

    dispatch(
      createAppointment({
        doctorId: id,
        date: selectedDate.date,
        time: selectedSlot,
      })
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        {doctor.user.name}
      </h1>
      <p>{doctor.specialty.name}</p>
      <p className="mt-4">{doctor.bio}</p>

      {/* Availability */}
      <div className="mt-6">
        <h3 className="font-bold mb-3">
          Available Dates
        </h3>

        <div className="flex gap-2 flex-wrap">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() =>
                dispatch(setSelectedDate(d))
              }
              className="border px-3 py-1 rounded"
            >
              {d.date}
            </button>
          ))}
        </div>

        {selectedDate && (
          <div className="mt-4">
            <h4 className="mb-2">
              Available Slots
            </h4>

            <div className="flex gap-2 flex-wrap">
              {selectedDate.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() =>
                    dispatch(setSelectedSlot(slot))
                  }
                  className="border px-2 py-1 rounded"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Button */}
      <button
        onClick={handleBooking}
        disabled={isLoading}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
}