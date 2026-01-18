import type { TimeZoneData } from '../types';

interface TimeZoneRowProps {
  data: TimeZoneData;
  onRemove: () => void;
  t: (key: string) => string;
}

export const TimeZoneRow = ({ data, onRemove, t }: TimeZoneRowProps) => {
  const { city, currentTime, gmtOffset, hours } = data;

  return (
    <div className="bg-white rounded-apple border border-apple-border shadow-apple p-4 md:p-6 mb-4 transition-apple">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-apple-dark">
            {city.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {city.country} • {gmtOffset}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500">{t('currentTime')}</p>
            <p className="text-base font-medium text-apple-dark">{currentTime}</p>
          </div>
          <button
            onClick={onRemove}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-apple-sm transition-apple"
            aria-label={t('remove')}
          >
            {t('remove')}
          </button>
        </div>
      </div>

      {/* Hours Grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max md:grid md:grid-cols-24 md:gap-1 md:min-w-0">
          {hours.map((hour) => (
            <div
              key={hour.hour}
              className={`
                w-12 h-12 md:w-auto md:h-16 flex items-center justify-center rounded-apple-sm text-xs font-medium
                transition-apple
                ${
                  hour.isCurrentHour
                    ? 'bg-apple-blue text-white shadow-md scale-105'
                    : hour.isWorkingHours
                    ? 'bg-apple-green/10 text-apple-green border border-apple-green/20'
                    : 'bg-gray-50 text-gray-600'
                }
              `}
            >
              <div className="text-center">
                <div className="font-semibold">{hour.hour}</div>
                <div className="text-[10px] opacity-75">{hour.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
