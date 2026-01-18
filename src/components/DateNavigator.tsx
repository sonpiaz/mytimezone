import { DateTime } from 'luxon';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  referenceTimezone: string;
}

// Helper function kiểm tra cuối tuần
const isWeekend = (date: DateTime): boolean => {
  const day = date.weekday; // 1 = Monday, 7 = Sunday
  return day === 6 || day === 7; // 6 = Saturday, 7 = Sunday
};

// Helper function lấy tên thứ
const getDayName = (date: DateTime): string => {
  return date.toFormat('EEE'); // "Sun", "Mon", "Tue", etc.
};

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
    <div className="flex items-center gap-1 mb-6">
      {/* Calendar icon - không có hover effect */}
      <div className="p-2 flex-shrink-0 cursor-default">
        <svg className="w-5 h-5 text-notion-textLight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Date buttons - Notion-style pill buttons */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {dates.map((date, index) => {
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          const weekend = isWeekend(date);
          const dayName = getDayName(date);
          
          // Format: "Jan 17" for today, just day number for others
          const displayText = isTodayDate 
            ? date.toFormat('MMM d') // "Jan 17"
            : date.toFormat('d'); // "16", "18", etc.

          // Tooltip text
          const tooltipText = isTodayDate ? `${dayName} / Today` : dayName;

          return (
            <div key={index} className="relative group flex-shrink-0">
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                {tooltipText}
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
              </div>
              
              {/* Date button */}
              <button
                onClick={() => handleDateClick(date)}
                className={`
                  relative flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${isSelectedDate
                    ? weekend
                      ? 'bg-notion-text text-red-300 ring-2 ring-red-400/50 shadow-notion-sm'  // Weekend + selected: text đỏ nhạt + ring đỏ
                      : 'bg-notion-text text-white shadow-notion-sm'                               // Weekday + selected: text trắng
                    : weekend
                      ? 'text-red-400 hover:bg-red-50'                                             // Weekend + not selected
                      : 'text-notion-textLight hover:bg-notion-hover'                              // Weekday + not selected
                  }
                `}
                aria-label={`Select date ${date.toFormat('MMMM d, yyyy')}`}
              >
                {displayText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
