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
    <div className="flex items-center gap-1 mb-6">
      {/* Calendar icon */}
      <button className="p-2 rounded-lg hover:bg-notion-hover transition-notion flex-shrink-0">
        <svg className="w-5 h-5 text-notion-textLight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Date buttons - Notion-style pill buttons */}
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
                flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-notion
                ${isSelectedDate
                  ? 'bg-notion-text text-white shadow-notion-sm'
                  : 'text-notion-textLight hover:bg-notion-hover'
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
