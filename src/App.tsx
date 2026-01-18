import { useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useUrlState } from './hooks/useUrlState';
import { useTimezones } from './hooks/useTimezones';
import { useTranslation } from './hooks/useTranslation';
import { useHoveredHour } from './hooks/useHoveredHour';
import { useTimelineLayout } from './hooks/useTimelineLayout';
import { SortableTimeZoneRow } from './components/SortableTimeZoneRow';
import { HoveredTimeColumn } from './components/HoveredTimeColumn';
import { CurrentTimeLine } from './components/CurrentTimeLine';
import { CityPicker } from './components/CityPicker';
import { ShareButton } from './components/ShareButton';
import { FeedbackButton } from './components/FeedbackButton';
import type { City } from './types';

function App() {
  const [cities, setCities] = useUrlState();
  const { timezoneData, currentHourColumn } = useTimezones(cities);
  const { language, t, toggleLanguage } = useTranslation();
  const { hoveredColumnIndex, hoverPosition, isHovering, handleMouseMove, handleColumnLeave } = useHoveredHour();
  const timelineLayout = useTimelineLayout();
  const { columnWidth, isDesktop, sidebarWidth } = timelineLayout;
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddCity = (city: City) => {
    setCities([...cities, city]);
  };

  const handleRemoveCity = (cityId: string) => {
    setCities(cities.filter(city => city.id !== cityId));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cities.findIndex((city) => city.id === active.id);
      const newIndex = cities.findIndex((city) => city.id === over.id);
      const newCities = arrayMove(cities, oldIndex, newIndex);
      setCities(newCities);
    }
  };

  // Auto-scroll to current time on mobile
  useEffect(() => {
    if (!isDesktop && containerRef.current && currentHourColumn !== null && timezoneData.length > 0) {
      const scrollPosition = currentHourColumn * columnWidth - (window.innerWidth / 2) + sidebarWidth;
      containerRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth',
      });
    }
  }, [isDesktop, currentHourColumn, columnWidth, sidebarWidth, timezoneData.length]);

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-apple-border shadow-sm z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      <main className="w-full">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-center w-full">
              <div className="relative w-full max-w-[1600px] mx-auto" data-timezone-container>
              {/* Main scroll container - ALWAYS scrollable */}
              <div 
                className="flex overflow-x-auto overflow-y-visible w-full"
                ref={containerRef}
                style={{
                  maxWidth: '100vw',
                  scrollbarGutter: 'stable',
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                }}
              >
                {/* Fixed left sidebar column */}
                <div 
                  className={`flex flex-col flex-shrink-0 z-10 bg-white ${!isDesktop ? 'sticky left-0' : ''}`}
                  style={{ width: `${sidebarWidth}px`, boxShadow: !isDesktop ? '2px 0 4px rgba(0,0,0,0.1)' : 'none' }}
                >
                  <SortableContext
                    items={timezoneData.map((data) => data.city.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {timezoneData.map((data) => (
                      <SortableTimeZoneRow
                        key={data.city.id}
                        data={data}
                        onRemove={() => handleRemoveCity(data.city.id)}
                        t={t}
                        onColumnLeave={handleColumnLeave}
                        sidebarOnly={true}
                        sidebarWidth={sidebarWidth}
                      />
                    ))}
                  </SortableContext>
                </div>
                
                {/* Scrollable timeline column - Force minimum width for all 24 columns */}
                <div 
                  className="flex flex-col flex-shrink-0"
                  style={{
                    minWidth: `${24 * columnWidth}px`,
                    width: `${24 * columnWidth}px`,
                  }}
                >
                  <SortableContext
                    items={timezoneData.map((data) => data.city.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {timezoneData.map((data) => (
                      <SortableTimeZoneRow
                        key={data.city.id}
                        data={data}
                        onRemove={() => handleRemoveCity(data.city.id)}
                        t={t}
                        onMouseMove={handleMouseMove}
                        onColumnLeave={handleColumnLeave}
                        timelineOnly={true}
                        columnWidth={columnWidth}
                        hoveredColumnIndex={hoveredColumnIndex}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
              
              {/* Vertical lines overlay */}
              {timezoneData.length > 0 && (
                <CurrentTimeLine 
                  containerRef={containerRef} 
                  timezoneData={timezoneData}
                  currentHourColumn={currentHourColumn}
                  columnWidth={columnWidth}
                  sidebarWidth={sidebarWidth}
                />
              )}
              <HoveredTimeColumn 
                columnIndex={hoveredColumnIndex} 
                hoverPosition={hoverPosition}
                containerRef={containerRef} 
                isActive={isHovering}
                columnWidth={columnWidth}
                sidebarWidth={sidebarWidth}
              />
              </div>
            </div>
          </DndContext>
        )}
        </div>
      </main>

      {/* Feedback Button */}
      <FeedbackButton t={t} />
    </div>
  );
}

export default App;
