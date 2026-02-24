import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctors,
  setNameFilter,
  setSpecialtyFilter,
  setPage,
} from "../../features/doctor/doctorSlice";
import { fetchSpecialties } from "../../features/specialty/specialtySlice";
import { Link } from "react-router-dom";

export default function DoctorListPage() {
  const dispatch = useDispatch();
  const { doctors, filters, pages, loading } =
    useSelector((state) => state.doctor);
  const { specialties } = useSelector(
    (state) => state.specialty
  );

  useEffect(() => {
    dispatch(fetchDoctors(filters));
  }, [filters]);

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Doctors
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={filters.name}
          onChange={(e) =>
            dispatch(setNameFilter(e.target.value))
          }
          className="border p-2 rounded w-full"
        />

        <select
          value={filters.specialty}
          onChange={(e) =>
            dispatch(setSpecialtyFilter(e.target.value))
          }
          className="border p-2 rounded"
        >
          <option value="">All Specialties</option>
          {specialties.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="border p-4 rounded"
            >
              <h3 className="font-bold">
                {doc.user.name}
              </h3>
              <p>{doc.specialty.name}</p>
              <p>${doc.consultationFee}</p>

              <Link
                to={`/doctors/${doc._id}`}
                className="text-blue-600 mt-2 inline-block"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            onClick={() => dispatch(setPage(i + 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}