// src/pages/patient/DoctorDetailsPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById, clearSelectedDoctor } from '../../features/doctor/doctorSlice';
import { selectSelectedDoctor, selectDoctorLoading, selectDoctorError } from '../../features/doctor/doctorSelectors';

import { DoctorProfileHeader } from '../../components/ui/DoctorProfileHeader.jsx';
import { AvailabilitySlots } from '../../components/ui/AvailabilitySlots.jsx';
import GlobalLoader from '../../components/ui/GlobalLoader.jsx';

export const DoctorDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doctor = useSelector(selectSelectedDoctor);
  const loading = useSelector(selectDoctorLoading);
  const error = useSelector(selectDoctorError);

  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorById(id));
    }

    // Cleanup: Clear selected doctor when leaving the page
    return () => {
      dispatch(clearSelectedDoctor());
    };
  }, [dispatch, id]);

  if (loading) return <GlobalLoader />;

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
      <p className="text-red-500 mb-6">{error}</p>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
        Go Back
      </button>
    </div>
  );

  if (!doctor) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      
      {/* Breadcrumb / Back button */}
      <button 
        onClick={() => navigate('/patient/doctors')}
        className="text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-2 text-sm font-medium transition-colors"
      >
        &larr; Back to Doctors List
      </button>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Doctor Profile (7 columns wide on large screens) */}
        <div className="lg:col-span-7">
          <DoctorProfileHeader doctor={doctor} />
        </div>

        {/* Right Column: Appointment Booking (5 columns wide on large screens) */}
        <div className="lg:col-span-5">
          <AvailabilitySlots doctorId={doctor._id} />
        </div>

      </div>
    </div>
  );
};