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
    <div className="flex items-center gap-2 mb-6">
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
                  relative flex-shrink-0 px-3 py-1 rounded-notion-md text-sm font-medium transition-all
                  ${isSelectedDate
                    ? weekend
                      ? 'bg-[#FEF9C3] text-red-500'  // Weekend + selected: background vàng nhạt, text đỏ
                      : 'bg-[#FEF9C3] text-[#37352F]' // Weekday + selected: background vàng nhạt, text đen
                    : weekend
                      ? 'text-red-400 hover:bg-gray-100'  // Weekend + not selected: text đỏ nhạt
                      : 'text-[#6B6B6B] hover:bg-gray-100' // Weekday + not selected: text xám
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
