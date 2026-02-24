import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300 h-full">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-50 mb-4 border-2 border-white shadow-sm">
        <img 
          src={doctor.user?.avatar || '/placeholder-avatar.png'} 
          alt={doctor.user?.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-1">{doctor.user?.name}</h3>
      <p className="text-gray-500 text-sm mb-2">{doctor.specialty?.name}</p>
      
      <div className="flex items-center justify-center text-gray-400 text-sm mb-6">
        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
        <span className="truncate">{doctor.clinicAddress || 'Medical Center'}</span>
      </div>
      
      {/* FIXED 4.3.2: Uses _id instead of id */}
      <Link 
        to={`/doctors/${doctor._id}`} 
        className="mt-auto w-full bg-[#4A90E2] hover:bg-blue-600 text-white font-medium py-2.5 rounded-xl transition-colors duration-200 block"
      >
        View Profile
      </Link>
    </div>
  );
};