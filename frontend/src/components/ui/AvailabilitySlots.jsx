// src/components/ui/AvailabilitySlots.jsx
import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const AvailabilitySlots = ({ doctorId }) => {
  // NOTE FOR PERSON 3: Replace these states with Redux useSelector(selectAvailability)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Mock slots for UI testing
  const mockMorningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:15 AM'];
  const mockAfternoonSlots = ['01:00 PM', '02:45 PM', '04:00 PM'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule an Appointment</h2>
      
      {/* Date Picker Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-gray-700">
          {format(selectedDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mock Calendar Row (Person 3 can expand this into a full calendar grid) */}
      <div className="grid grid-cols-5 gap-2 mb-8">
        {[0, 1, 2, 3, 4].map((offset) => {
          const date = addDays(new Date(), offset);
          const isSelected = format(date, 'd') === format(selectedDate, 'd');
          return (
            <button
              key={offset}
              onClick={() => setSelectedDate(date)}
              className={twMerge(clsx(
                "py-3 rounded-xl border flex flex-col items-center justify-center transition-colors",
                isSelected 
                  ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50"
              ))}
            >
              <span className="text-xs font-medium uppercase">{format(date, 'EEE')}</span>
              <span className="text-lg font-bold">{format(date, 'd')}</span>
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Morning</h4>
        <div className="grid grid-cols-3 gap-3">
          {mockMorningSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedSlot(time)}
              className={twMerge(clsx(
                "py-2 px-1 rounded-lg border text-sm font-medium transition-colors text-center",
                selectedSlot === time 
                  ? "bg-[#0A2540] text-white border-[#0A2540]" // Dark blue from design
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-500"
              ))}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Afternoon</h4>
        <div className="grid grid-cols-3 gap-3">
          {mockAfternoonSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedSlot(time)}
              className={twMerge(clsx(
                "py-2 px-1 rounded-lg border text-sm font-medium transition-colors text-center",
                selectedSlot === time 
                  ? "bg-[#0A2540] text-white border-[#0A2540]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-500"
              ))}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button 
        disabled={!selectedSlot}
        className="w-full bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors duration-200 flex justify-center items-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        Book Appointment
      </button>
    </div>
  );
};