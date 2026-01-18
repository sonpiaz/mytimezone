import { useRef, useEffect, useState } from 'react';
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
import { CurrentTimeLine } from './components/CurrentTimeLine';
import { CityPicker } from './components/CityPicker';
import { DateNavigator } from './components/DateNavigator';
import { ShareButton } from './components/ShareButton';
import { FeedbackButton } from './components/FeedbackButton';
import type { City } from './types';

function App() {
  const [cities, setCities] = useUrlState();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { timezoneData, currentHourColumn } = useTimezones(cities, selectedDate);
  const { language, t, toggleLanguage } = useTranslation();
  const { hoveredColumnIndex, handleMouseMove, handleColumnLeave } = useHoveredHour();
  const timelineLayout = useTimelineLayout();
  const { columnWidth, isDesktop, sidebarWidth } = timelineLayout;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get reference timezone for DateNavigator
  const referenceTimezone = cities.length > 0 ? cities[0].timezone : 'America/Los_Angeles';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Date Navigator */}
        {cities.length > 0 && (
          <div className="mb-4">
            <DateNavigator
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              referenceTimezone={referenceTimezone}
            />
          </div>
        )}
        
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
              <div 
                className="relative w-full max-w-7xl mx-auto" 
                data-timezone-container
                onMouseMove={(e) => {
                  // Only handle mouse move if we're over the timeline area
                  const target = e.target as HTMLElement;
                  const grid = target.closest('[data-hours-grid]');
                  if (grid) {
                    const gridRect = grid.getBoundingClientRect();
                    const mouseX = e.clientX - gridRect.left;
                    const columnIndex = Math.floor(mouseX / columnWidth);
                    const clampedColumnIndex = Math.max(0, Math.min(23, columnIndex));
                    const containerRect = containerRef.current?.getBoundingClientRect();
                    if (containerRect) {
                      const absoluteX = e.clientX - containerRect.left;
                      handleMouseMove(absoluteX, clampedColumnIndex);
                    }
                  }
                }}
                onMouseLeave={handleColumnLeave}
              >
              {/* Main container - Each row has its own sidebar + timeline */}
              <div 
                className="w-full overflow-x-auto"
                ref={containerRef}
                style={{
                  maxWidth: '100vw',
                  scrollbarGutter: 'stable',
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                }}
              >
                <SortableContext
                  items={timezoneData.map((data) => data.city.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {timezoneData.map((data) => (
                    <div key={data.city.id} className="flex w-full min-w-max">
                      {/* Sidebar - Fixed, sticky on mobile */}
                      <div 
                        className={`flex-shrink-0 bg-white ${!isDesktop ? 'sticky left-0 z-30 border-r border-gray-200' : 'z-10'}`}
                        style={{ 
                          width: `${sidebarWidth}px`, 
                          minWidth: `${sidebarWidth}px`,
                          boxShadow: !isDesktop ? '2px 0 8px rgba(0,0,0,0.15)' : 'none',
                        }}
                      >
                        <SortableTimeZoneRow
                          data={data}
                          onRemove={() => handleRemoveCity(data.city.id)}
                          t={t}
                          sidebarOnly={true}
                          sidebarWidth={sidebarWidth}
                          hoveredColumnIndex={null}
                          isDesktop={isDesktop}
                        />
                      </div>
                      
                      {/* Timeline - No overflow, scroll handled by parent */}
                      <div 
                        className="flex-shrink-0"
                        style={{
                          minWidth: `${24 * columnWidth}px`,
                          width: `${24 * columnWidth}px`,
                        }}
                      >
                        <SortableTimeZoneRow
                          data={data}
                          onRemove={() => handleRemoveCity(data.city.id)}
                          t={t}
                          timelineOnly={true}
                          columnWidth={columnWidth}
                          hoveredColumnIndex={hoveredColumnIndex}
                          isDesktop={isDesktop}
                        />
                      </div>
                    </div>
                  ))}
                </SortableContext>
              </div>
              
              {/* Current Time Line - Solid border indicator (positioned relative to scroll container) */}
              {timezoneData.length > 0 && currentHourColumn !== null && (
                <CurrentTimeLine
                  timezoneData={timezoneData}
                  currentHourColumn={currentHourColumn}
                  hoveredColumnIndex={hoveredColumnIndex}
                  columnWidth={columnWidth}
                  sidebarWidth={sidebarWidth}
                />
              )}
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
