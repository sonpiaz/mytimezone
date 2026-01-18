import { useUrlState } from './hooks/useUrlState';
import { useTimezones } from './hooks/useTimezones';
import { useTranslation } from './hooks/useTranslation';
import { TimeZoneRow } from './components/TimeZoneRow';
import { CityPicker } from './components/CityPicker';
import { ShareButton } from './components/ShareButton';
import { FeedbackButton } from './components/FeedbackButton';
import type { City } from './types';

function App() {
  const [cities, setCities] = useUrlState();
  const timezoneData = useTimezones(cities);
  const { language, t, toggleLanguage } = useTranslation();

  const handleAddCity = (city: City) => {
    setCities([...cities, city]);
  };

  const handleRemoveCity = (cityId: string) => {
    setCities(cities.filter(city => city.id !== cityId));
  };

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-apple-border shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-apple-dark">
                {t('title')}
              </h1>
              <p className="text-sm text-gray-600 mt-1 hidden md:block">
                {t('subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 text-sm text-apple-dark hover:bg-gray-100 rounded-apple-sm transition-apple"
                aria-label={t('language')}
              >
                {language === 'vi' ? 'EN' : 'VI'}
              </button>
              <ShareButton t={t} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* City Picker */}
        <CityPicker
          selectedCities={cities}
          onAddCity={handleAddCity}
          t={t}
        />

        {/* Timezone Rows */}
        {timezoneData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('noCities')}</p>
          </div>
        ) : (
          <div>
            {timezoneData.map((data) => (
              <TimeZoneRow
                key={data.city.id}
                data={data}
                onRemove={() => handleRemoveCity(data.city.id)}
                t={t}
              />
            ))}
          </div>
        )}
      </main>

      {/* Feedback Button */}
      <FeedbackButton t={t} />
    </div>
  );
}

export default App;
