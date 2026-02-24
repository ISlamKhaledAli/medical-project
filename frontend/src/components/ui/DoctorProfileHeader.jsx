// src/components/ui/DoctorProfileHeader.jsx
import { MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react';

export const DoctorProfileHeader = ({ doctor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center md:items-start md:text-left h-full">
      
      {/* Avatar */}
      <div className="w-40 h-40 rounded-full overflow-hidden bg-blue-50 border-4 border-white shadow-lg mx-auto md:mx-0 mb-6 relative">
        <img 
          src={doctor.user?.avatar || '/placeholder-avatar.png'} 
          alt={`Dr. ${doctor.user?.name}`} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Name & Title */}
      <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2 mb-2">
        Dr. {doctor.user?.name}
        <CheckCircle className="w-6 h-6 text-blue-500" /> {/* Verified Badge */}
      </h1>
      <p className="text-lg text-gray-600 font-medium mb-6">
        {doctor.specialty?.name}
      </p>

      {/* Bio / Description */}
      <p className="text-gray-600 leading-relaxed mb-8">
        {doctor.bio || 'This doctor is a board-certified specialist dedicated to providing personalized patient care with years of extensive experience in their field.'}
      </p>

      {/* Contact & Info Details */}
      <div className="w-full space-y-4 border-t border-gray-100 pt-6">
        <div className="flex items-center text-gray-700">
          <Phone className="w-5 h-5 mr-3 text-blue-500" />
          <span className="font-medium">{doctor.user?.phone || 'Not provided'}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Mail className="w-5 h-5 mr-3 text-blue-500" />
          <span className="font-medium">{doctor.user?.email}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <MapPin className="w-5 h-5 mr-3 text-blue-500" />
          <span className="font-medium">{doctor.clinicAddress || 'Hospital Main Building'}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Award className="w-5 h-5 mr-3 text-blue-500" />
          <span className="font-medium">{doctor.experienceYears || 0} Years Experience</span>
        </div>
      </div>
    </div>
  );
};