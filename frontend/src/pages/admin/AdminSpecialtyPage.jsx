import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpecialties,
  createSpecialty,
  deleteSpecialty,
} from "../../features/specialty/specialtySlice";

export default function AdminSpecialtyPage() {
  const dispatch = useDispatch();
  const { specialties } = useSelector(
    (state) => state.specialty
  );

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, []);

  const handleAdd = () => {
    if (!name) return;
    dispatch(createSpecialty({ name }));
    setName("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Manage Specialties
      </h2>

      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Specialty name"
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul>
        {specialties.map((s) => (
          <li
            key={s._id}
            className="flex justify-between mb-2"
          >
            {s.name}
            <button
              onClick={() =>
                dispatch(deleteSpecialty(s._id))
              }
              className="text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}