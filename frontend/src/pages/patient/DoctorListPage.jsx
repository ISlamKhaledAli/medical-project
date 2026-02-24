import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors, fetchSpecialties } from '../../features/doctor/doctorSlice.js';
import { 
  selectAllDoctors, selectAllSpecialties, selectDoctorLoading, 
  selectDoctorError, selectDoctorPagination 
} from '../../features/doctor/doctorSelectors.js';
import { DoctorCard } from '../../components/ui/DoctorCard.jsx';
import { SpecialtyFilters } from '../../components/ui/SpecialtyFilters.jsx';
import { DoctorCardSkeleton } from '../../components/skeletons/DoctorCardSkeleton.jsx';

export const DoctorListPage = () => {
  const dispatch = useDispatch();
  
  const doctors = useSelector(selectAllDoctors);
  const specialties = useSelector(selectAllSpecialties);
  const loading = useSelector(selectDoctorLoading);
  const error = useSelector(selectDoctorError);
  const pagination = useSelector(selectDoctorPagination);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // FIXED 2.1.2: Pagination state

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchDoctors({ 
        page: currentPage, 
        limit: 9, 
        search: searchTerm, 
        specialtyId: selectedSpecialty 
      }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, searchTerm, selectedSpecialty, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialty]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Search Bar */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by doctor name..." 
          className="p-3 border rounded-lg w-full md:w-1/2 focus:ring-2 focus:ring-[#4A90E2] outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Specialty Filters component */}
      <SpecialtyFilters 
        specialties={specialties} 
        selected={selectedSpecialty} 
        onChange={setSelectedSpecialty} 
      />

      {/* FIXED 2.1.4: Error Display */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <DoctorCardSkeleton key={i} />)
        ) : doctors?.length > 0 ? (
          doctors.map((doctor) => (
             // FIXED 2.1.1: Uses imported DoctorCard
             <DoctorCard key={doctor._id} doctor={doctor} />
          ))
        ) : (
          // FIXED 2.1.5: Missing "No results" state
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or specialty filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedSpecialty(''); }}
              className="text-[#4A90E2] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* FIXED 2.1.2: Pagination UI */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button 
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button 
            disabled={currentPage === pagination.totalPages || loading}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};