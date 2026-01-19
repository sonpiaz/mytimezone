import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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
import { useUrlState } from '../hooks/useUrlState';
import { useTimezones } from '../hooks/useTimezones';
import { useTranslation } from '../hooks/useTranslation';
import { useHoveredHour } from '../hooks/useHoveredHour';
import { useTimelineLayout } from '../hooks/useTimelineLayout';
import { SortableTimeZoneRow } from './SortableTimeZoneRow';
import { TimeIndicator } from './CurrentTimeLine';
import { MobileTimezoneView } from './MobileTimezoneView';
import { CitySearch } from './CitySearch';
import { ShareButton } from './ShareButton';
import { ToastManager } from './Toast';
import { MeetingScheduler } from './MeetingScheduler';
import { EmbedModal } from './EmbedModal';
import { OfflineIndicator } from './OfflineIndicator';
import { InstallPrompt } from './InstallPrompt';
import { Footer } from './Footer';
import type { City } from '../types';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export function HomePage() {
  // Debug: Log when HomePage renders
  useEffect(() => {
    console.log('=== HOME PAGE RENDERED ===');
  }, []);
  
  const [cities, setCities] = useUrlState();
  const [showScheduler, setShowScheduler] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  // Always use today's date (no date navigation needed)
  const selectedDate = new Date();
  const { timezoneData, currentHourColumn } = useTimezones(cities, selectedDate);
  
  // Always show current time indicator (always viewing today)
  const isSelectedDateToday = true;
  
  const { language, t, toggleLanguage } = useTranslation();
  const { hoveredColumnIndex, hoveredCellPosition, handleMouseMove, handleCellHover, handleColumnLeave } = useHoveredHour();
  const [currentHourCellPosition, setCurrentHourCellPosition] = useState<{ left: number; width: number } | null>(null);
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
  
  // Get current hour cell position from DOM
  useEffect(() => {
    if (currentHourColumn !== null && containerRef.current) {
      const updateCurrentHourPosition = () => {
        // Find the current hour cell in the first timeline row (reference timezone)
        const currentHourCell = containerRef.current?.querySelector(
          `[data-hour-cell][data-column-index="${currentHourColumn}"]`
        ) as HTMLElement | null;
        
        if (currentHourCell && containerRef.current) {
          const cellRect = currentHourCell.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          
          const left = cellRect.left - containerRect.left;
          const width = cellRect.width;
          
          setCurrentHourCellPosition({ left, width });
          
          // Debug logging (dev only)
          if (import.meta.env.DEV && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.log('=== CURRENT HOUR POSITION ===');
            console.log('Current hour column:', currentHourColumn);
            console.log('Cell left (relative):', left);
            console.log('Cell width:', width);
          }
        }
      };
      
      // Update immediately and on resize
      updateCurrentHourPosition();
      window.addEventListener('resize', updateCurrentHourPosition);
      
      // Update every minute when time changes
      const interval = setInterval(updateCurrentHourPosition, 60000);
      
      return () => {
        window.removeEventListener('resize', updateCurrentHourPosition);
        clearInterval(interval);
      };
    }
  }, [currentHourColumn, timezoneData]);

  // Sensors configuration
  // Desktop: PointerSensor (mouse) with distance constraint
  // Mobile: TouchSensor with long press (500ms delay)
  // IMPORTANT: Exclude Footer and links from drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500,        // Long press 500ms on mobile
        tolerance: 5,      // Allow slight movement while waiting
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
    <div className="min-h-screen bg-notion-bg flex flex-col">
      {/* Header - Notion style */}
      <header className="sticky top-0 bg-white border-b border-notion-border z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/"
                className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
              >
                <h1 className="text-2xl font-semibold text-notion-text">
                  {t('title')}
                </h1>
              </Link>
              <p className="text-sm text-notion-textLight mt-1 hidden md:block">
                {t('subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Switcher - với icon */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-1.5 text-sm text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6] rounded transition-colors font-normal"
                aria-label={t('language')}
              >
                <span className="text-base">🌐</span>
                <span>{language === 'vi' ? 'VI' : 'EN'}</span>
              </button>
              
              {/* Share Button - Ghost style */}
              <ShareButton t={t} cities={cities} />
              
              {/* Embed Button */}
              <button
                onClick={() => setShowEmbedModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors font-normal"
                title="Embed Widget"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <span className="hidden sm:inline">&lt;/&gt;</span>
              </button>
              
              {/* Find Best Time - Primary CTA */}
              {cities.length >= 2 && (
                <button
                  onClick={() => setShowScheduler(true)}
                  className="px-3 py-1.5 text-sm bg-[#191919] text-white rounded-md hover:bg-[#333333] flex items-center gap-1.5 transition-colors font-medium"
                >
                  <span className="text-xs">✨</span>
                  <span className="hidden sm:inline">{t('findBestTime')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Notion style centered container */}
      <main className="w-full">
        <div className="max-w-6xl mx-auto px-6 py-8">
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
                onRemoveCity={handleRemoveCity}
                t={t}
              />
              
              {/* Single Time Indicator - Mobile */}
              {timezoneData.length > 0 && (
                <TimeIndicator
                  cellPosition={hoveredCellPosition || currentHourCellPosition}
                  totalCities={timezoneData.length}
                  isMobile={true}
                  showIndicator={isSelectedDateToday}
                />
              )}
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
                  const hourCell = target.closest('[data-hour-cell]') as HTMLElement | null;
                  
                  if (hourCell && containerRef.current) {
                    const cellRect = hourCell.getBoundingClientRect();
                    const containerRect = containerRef.current.getBoundingClientRect();
                    
                    // Calculate position relative to container
                    const left = cellRect.left - containerRect.left;
                    const width = cellRect.width;
                    const columnIndex = hourCell.dataset.columnIndex 
                      ? parseInt(hourCell.dataset.columnIndex, 10)
                      : 0;
                    
                    // Emit cell position
                    handleCellHover({ left, width, columnIndex });
                    
                    // Debug logging (dev only)
                    if (import.meta.env.DEV && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                      console.log('=== CELL HOVER ===');
                      console.log('Cell left (absolute):', cellRect.left);
                      console.log('Container left:', containerRect.left);
                      console.log('Cell left (relative):', left);
                      console.log('Cell width:', width);
                      console.log('Column index:', columnIndex);
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
                      <div 
                        key={data.city.id} 
                        className="flex w-full min-w-max items-stretch"
                        style={{ minHeight: '80px' }}
                      >
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
                </div>
                
                {/* Single Time Indicator - Desktop: Render OUTSIDE overflow container */}
                {timezoneData.length > 0 && isDesktop && (
                  <TimeIndicator
                    cellPosition={hoveredCellPosition || currentHourCellPosition}
                    totalCities={timezoneData.length}
                    isMobile={false}
                    showIndicator={isSelectedDateToday}
                  />
                )}
              </div>
            </div>
          </DndContext>
        )}
        </div>
      </main>

      {/* Footer - OUTSIDE DndContext */}
      <Footer />
      
      {/* PWA Components */}
      <OfflineIndicator />
      <InstallPrompt />
      
      {/* Toast Notifications */}
      <ToastManager toasts={toasts} onRemove={removeToast} />
      
      {/* Meeting Scheduler */}
      {showScheduler && (
        <MeetingScheduler
          isOpen={showScheduler}
          onClose={() => setShowScheduler(false)}
          cities={cities}
          onCopy={() => showToast(t('meetingLinkCopied'), 'success')}
        />
      )}

      {/* Embed Modal */}
      <EmbedModal
        isOpen={showEmbedModal}
        onClose={() => setShowEmbedModal(false)}
        cities={cities}
      />
    </div>
  );
}
