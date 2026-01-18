import { DateTime } from 'luxon';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  referenceTimezone: string;
}

export const DateNavigator = ({ selectedDate, onDateSelect, referenceTimezone }: DateNavigatorProps) => {
  const selectedDateTime = DateTime.fromJSDate(selectedDate).setZone(referenceTimezone);
  const today = DateTime.now().setZone(referenceTimezone);
  
  // Generate 7 days: 1 day before + today + 5 days after
  const dates: DateTime[] = [];
  for (let i = -1; i <= 5; i++) {
    dates.push(today.plus({ days: i }));
  }

  const isToday = (date: DateTime): boolean => {
    return date.hasSame(today, 'day') && date.hasSame(today, 'month') && date.hasSame(today, 'year');
  };

  const isSelected = (date: DateTime): boolean => {
    return date.hasSame(selectedDateTime, 'day') && date.hasSame(selectedDateTime, 'month') && date.hasSame(selectedDateTime, 'year');
  };

  const handleDateClick = (date: DateTime) => {
    onDateSelect(date.toJSDate());
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200">
      {/* Calendar icon */}
      <div className="flex-shrink-0 text-gray-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Date buttons */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {dates.map((date, index) => {
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          
          // Format: "Jan 17" for today, just day number for others
          const displayText = isTodayDate 
            ? date.toFormat('MMM d') // "Jan 17"
            : date.toFormat('d'); // "16", "18", etc.

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${isSelectedDate
                  ? 'bg-blue-500 text-white shadow-md'
                  : isTodayDate
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              aria-label={`Select date ${date.toFormat('MMMM d, yyyy')}`}
            >
              {displayText}
            </button>
          );
        })}
      </div>
    </div>
  );
};
