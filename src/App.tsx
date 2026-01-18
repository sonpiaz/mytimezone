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
import { MobileTimezoneView } from './components/MobileTimezoneView';
import { CitySearch } from './components/CitySearch';
import { DateNavigator } from './components/DateNavigator';
import { ShareButton } from './components/ShareButton';
import { FeedbackButton } from './components/FeedbackButton';
import { ToastManager } from './components/Toast';
import { MeetingScheduler } from './components/MeetingScheduler';
import type { City } from './types';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

function App() {
  const [cities, setCities] = useUrlState();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduler, setShowScheduler] = useState(false);
  const { timezoneData, currentHourColumn } = useTimezones(cities, selectedDate);
  
  // Check if selected date is today (for showing current time indicator)
  const isSelectedDateToday = (() => {
    if (!selectedDate) return true;
    const today = new Date();
    const selected = new Date(selectedDate);
    return (
      today.getFullYear() === selected.getFullYear() &&
      today.getMonth() === selected.getMonth() &&
      today.getDate() === selected.getDate()
    );
  })();
  
  const { language, t, toggleLanguage } = useTranslation();
  const { hoveredColumnIndex, handleMouseMove, handleColumnLeave } = useHoveredHour();
  const timelineLayout = useTimelineLayout();
  const { columnWidth, isDesktop, sidebarWidth } = timelineLayout;
  const containerRef = useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  
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
    try {
      setCities([...cities, city]);
      showToast(t('cityAdded') || `Added ${city.name}`, 'success');
    } catch (error) {
      console.error('Failed to add city:', error);
      showToast(t('errorAddingCity') || 'Failed to add city', 'error');
    }
  };

  const handleRemoveCity = (cityId: string) => {
    try {
      const city = cities.find(c => c.id === cityId);
      setCities(cities.filter(city => city.id !== cityId));
      if (city) {
        showToast(t('cityRemoved') || `Removed ${city.name}`, 'info');
      }
    } catch (error) {
      console.error('Failed to remove city:', error);
      showToast(t('errorRemovingCity') || 'Failed to remove city', 'error');
    }
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
    <div className="min-h-screen bg-notion-bg">
      {/* Header - Notion style */}
      <header className="sticky top-0 bg-white border-b border-notion-border z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-notion-text">
                {t('title')}
              </h1>
              <p className="text-sm text-notion-textLight mt-1 hidden md:block">
                {t('subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {cities.length >= 2 && (
                <button
                  onClick={() => setShowScheduler(true)}
                  className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
                >
                  <span>🎯</span>
                  <span className="hidden sm:inline">Find Best Time</span>
                </button>
              )}
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 text-sm text-notion-textLight hover:bg-notion-hover rounded-lg transition-notion"
                aria-label={t('language')}
              >
                {language === 'vi' ? 'EN' : 'VI'}
              </button>
              <ShareButton t={t} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Notion style centered container */}
      <main className="w-full">
        <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Date Navigator */}
        {cities.length > 0 && (
          <div className="mb-6">
            <DateNavigator
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              referenceTimezone={referenceTimezone}
            />
          </div>
        )}
        
        {/* City Search */}
        <div className="mb-6">
          <CitySearch
            selectedCities={cities}
            onAddCity={handleAddCity}
            t={t}
          />
        </div>

        {/* Timezone Rows */}
        {timezoneData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-notion-textLight">{t('noCities')}</p>
          </div>
        ) : !isDesktop ? (
          // Mobile: Single scroll container layout
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div 
              className="relative w-full"
              data-timezone-container
              onMouseMove={(e) => {
                const target = e.target as HTMLElement;
                const grid = target.closest('[data-hours-grid]');
                if (grid) {
                  const gridRect = grid.getBoundingClientRect();
                  const mouseX = e.clientX - gridRect.left;
                  const columnIndex = Math.floor(mouseX / columnWidth);
                  const clampedColumnIndex = Math.max(0, Math.min(23, columnIndex));
                  handleMouseMove(mouseX, clampedColumnIndex);
                }
              }}
              onMouseLeave={handleColumnLeave}
            >
              <MobileTimezoneView
                timezoneData={timezoneData}
                currentHourColumn={currentHourColumn}
                hoveredColumnIndex={hoveredColumnIndex}
                columnWidth={columnWidth}
              />
            </div>
          </DndContext>
        ) : (
          // Desktop: Side-by-side layout
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
                  const target = e.target as HTMLElement;
                  const grid = target.closest('[data-hours-grid]');
                  if (grid) {
                    const gridRect = grid.getBoundingClientRect();
                    const mouseX = e.clientX - gridRect.left;
                    // Desktop: Use grid width / 24. Mobile: Use columnWidth
                    const gridWidth = gridRect.width;
                    const columnIndex = isDesktop 
                      ? Math.floor((mouseX / gridWidth) * 24)
                      : Math.floor(mouseX / columnWidth);
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
                <div 
                  className={`relative w-full ${isDesktop ? 'overflow-x-hidden' : 'overflow-x-auto'}`}
                  ref={containerRef}
                  style={{
                    maxWidth: '100vw',
                    ...(isDesktop ? {} : {
                      scrollbarGutter: 'stable',
                      overscrollBehavior: 'contain',
                      WebkitOverflowScrolling: 'touch',
                      scrollBehavior: 'smooth',
                    }),
                  }}
                >
                  <SortableContext
                    items={timezoneData.map((data) => data.city.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {timezoneData.map((data) => (
                      <div key={data.city.id} className="flex w-full min-w-max">
                        {/* Sidebar - Fixed */}
                        <div 
                          className="flex-shrink-0 bg-white z-10"
                          style={{ 
                            width: `${sidebarWidth}px`, 
                            minWidth: `${sidebarWidth}px`,
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
                        
                        {/* Timeline */}
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
                  
                  {/* Current Time Line - Desktop only */}
                  {timezoneData.length > 0 && (
                    <CurrentTimeLine
                      timezoneData={timezoneData}
                      currentHourColumn={currentHourColumn}
                      hoveredColumnIndex={hoveredColumnIndex}
                      columnWidth={columnWidth}
                      sidebarWidth={sidebarWidth}
                      showCurrentTime={isSelectedDateToday}
                    />
                  )}
                </div>
              </div>
            </div>
          </DndContext>
        )}
        </div>
      </main>

      {/* Feedback Button */}
      <FeedbackButton t={t} />
      
      {/* Toast Notifications */}
      <ToastManager toasts={toasts} onRemove={removeToast} />
      
      {/* Meeting Scheduler */}
      {showScheduler && (
        <MeetingScheduler
          isOpen={showScheduler}
          onClose={() => setShowScheduler(false)}
          cities={cities}
          onCopy={() => showToast('Copied to clipboard!', 'success')}
        />
      )}
    </div>
  );
}

export default App;
