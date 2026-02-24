import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const SpecialtyFilters = ({ specialties, selected, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      {specialties.map((spec) => {
        // نستخدم _id لو موجود من الداتا بيز، أو id لو من الـ Mock Data
        const specId = spec._id || spec.id; 
        
        return (
          <button
            key={specId}
            onClick={() => onChange(specId === selected ? '' : specId)}
            className={twMerge(
              clsx(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                selected === specId
                  ? "bg-[#4A90E2] text-white border-[#4A90E2] shadow-sm" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              )
            )}
          >
            {spec.name}
          </button>
        );
      })}
    </div>
  );
};