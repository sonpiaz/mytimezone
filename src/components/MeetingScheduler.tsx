import { useState, useEffect, useRef } from 'react';
import type { City } from '../types';
import type { Participant, WorkingHours, SchedulerResult } from '../types/meetingScheduler';
import { findBestMeetingTimes } from '../utils/meetingScheduler';
import { ResultSection } from './ResultSection';
import { useClickOutside } from '../hooks/useClickOutside';
import { useTranslation } from '../hooks/useTranslation';
import { loadMeetingSettings, saveMeetingSettings } from '../utils/storageHelpers';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];  // Current cities from timeline
  onCopy?: () => void;
}

export const MeetingScheduler = ({ isOpen, onClose, cities, onCopy }: MeetingSchedulerProps) => {
  const { t } = useTranslation();
  
  // State - Initialize from localStorage
  const [participants, setParticipants] = useState<Participant[]>([]);
  const savedSettings = loadMeetingSettings();
  const [workingHours, setWorkingHours] = useState<WorkingHours>({ 
    start: savedSettings.workingHoursStart, 
    end: savedSettings.workingHoursEnd 
  });
  const [duration, setDuration] = useState(savedSettings.meetingDuration / 60); // Convert minutes to hours
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [results, setResults] = useState<SchedulerResult | null>(null);
  const [meetingTitle, setMeetingTitle] = useState('Team Meeting');
  
  // Ref for modal content (to detect clicks outside)
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Click outside to close modal
  useClickOutside(modalRef, onClose, isOpen);

  // Initialize participants from cities
  useEffect(() => {
    if (cities.length > 0) {
      setParticipants(
        cities.map((city, index) => ({
          city,
          isSelected: true,
          isHost: index === 0, // First city is host
        }))
      );
    }
  }, [cities]);

  const toggleParticipant = (index: number) => {
    setParticipants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isSelected: !updated[index].isSelected };
      return updated;
    });
  };

  const setHost = (index: number) => {
    setParticipants((prev) => {
      const updated = prev.map((p, i) => ({
        ...p,
        isHost: i === index,
      }));
      return updated;
    });
  };

  // Find best times
  const handleFindTimes = () => {
    const selectedParticipants = participants.filter(p => p.isSelected);
    if (selectedParticipants.length < 2) {
      // Show error toast if available
      return;
    }

    const result = findBestMeetingTimes(
      selectedParticipants,
      workingHours,
      duration,
      selectedDate
    );
    setResults(result);
  };

  if (!isOpen) return null;

  const selectedCount = participants.filter(p => p.isSelected).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-notion-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-notion-border">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-notion-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-notion-text flex items-center gap-2">
            🎯 {t('findBestMeetingTime')}
          </h2>
          <button
            onClick={onClose}
            className="text-notion-textPlaceholder hover:text-notion-text transition-notion p-1 rounded hover:bg-notion-hover"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Participants */}
          <div className="mb-6">
            <label className="text-sm font-medium text-notion-text mb-3 block">
              {t('participants')}:
            </label>
            <div className="flex flex-wrap gap-2">
              {participants.map((p, index) => (
                <button
                  key={p.city.slug}
                  onClick={() => toggleParticipant(index)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setHost(index);
                  }}
                  title={p.isHost ? 'Host (right-click to change)' : 'Right-click to set as host'}
                  className={`
                    px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-all duration-150
                    ${p.isSelected
                      ? 'bg-[#F7F7F5] text-[#37352F] border border-[#37352F] hover:bg-[#F7F7F5]'
                      : 'bg-transparent text-[#37352F] border border-[#E5E5E5] hover:bg-[#F7F7F5]'
                    }
                  `}
                >
                  {p.isSelected && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {p.city.name}
                </button>
              ))}
            </div>
            {selectedCount < 2 && (
              <p className="text-xs text-notion-warning mt-2">{t('selectAtLeastTwo')}</p>
            )}
          </div>

          {/* Working Hours */}
          <div className="mb-4">
            <label className="text-sm font-medium text-notion-text mb-2 block">
              {t('workingHours')}:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={workingHours.start}
                onChange={(e) => {
                  const newStart = Number(e.target.value);
                  setWorkingHours(prev => ({ ...prev, start: newStart }));
                  saveMeetingSettings({ workingHoursStart: newStart });
                }}
                className="px-3 py-2 border border-notion-border rounded-lg text-sm text-notion-text bg-white hover:bg-notion-hover transition-notion"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
              <span className="text-notion-textLight">to</span>
              <select
                value={workingHours.end}
                onChange={(e) => {
                  const newEnd = Number(e.target.value);
                  setWorkingHours(prev => ({ ...prev, end: newEnd }));
                  saveMeetingSettings({ workingHoursEnd: newEnd });
                }}
                className="px-3 py-2 border border-notion-border rounded-lg text-sm text-notion-text bg-white hover:bg-notion-hover transition-notion"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
          </div>

          {/* Meeting Title */}
          <div className="mb-4">
            <label className="text-sm font-medium text-notion-text mb-2 block">
              Meeting Title:
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Enter meeting title"
              className="w-full px-3 py-2 border border-notion-border rounded-lg text-sm text-notion-text bg-white hover:bg-notion-hover focus:ring-2 focus:ring-[#191919] focus:border-transparent transition-notion"
            />
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="text-sm font-medium text-notion-text mb-2 block">
              {t('meetingDuration')}:
            </label>
            <div className="flex gap-2">
              {[0.5, 1, 1.5, 2].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDuration(d);
                    saveMeetingSettings({ meetingDuration: d * 60 }); // Convert hours to minutes
                  }}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
                    ${duration === d
                      ? 'bg-[#F7F7F5] text-[#37352F] border border-[#37352F]'
                      : 'bg-transparent text-[#6B7280] border border-[#E5E5E5] hover:bg-[#F7F7F5]'
                    }
                  `}
                >
                  {d === 0.5 ? `30 ${t('minutes')}` : `${d} ${t('hour')}`}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-notion-text mb-2 block">
              {t('date')}:
            </label>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-notion-border rounded-lg text-sm text-notion-text bg-white hover:bg-notion-hover transition-notion w-full"
            />
          </div>

          {/* Find Button */}
          <button
            onClick={handleFindTimes}
            disabled={selectedCount < 2}
            className={`
              w-full py-3 bg-[#191919] text-white rounded-lg font-medium 
              flex items-center justify-center gap-2 transition-all duration-150
              shadow-sm
              ${selectedCount < 2
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#333333] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('findBestTimes')}
          </button>

          {/* Results */}
          {results && (
            <div className="mt-6">
              {/* Perfect Slots - Limit to TOP 5 */}
              {results.perfect.length > 0 && (
                <ResultSection
                  title=""
                  slots={results.perfect}
                  variant="perfect"
                  onCopy={onCopy}
                  selectedDate={selectedDate}
                  duration={duration}
                  referenceTimezone={participants.find(p => p.isHost)?.city.timezone || participants[0]?.city.timezone || 'UTC'}
                  meetingTitle={meetingTitle}
                />
              )}

              {/* Sacrifice Slots - Limit to TOP 5 */}
              {results.sacrifice.length > 0 && (
                <ResultSection
                  title=""
                  slots={results.sacrifice}
                  variant="sacrifice"
                  onCopy={onCopy}
                  selectedDate={selectedDate}
                  duration={duration}
                  referenceTimezone={participants.find(p => p.isHost)?.city.timezone || participants[0]?.city.timezone || 'UTC'}
                  meetingTitle={meetingTitle}
                />
              )}

              {/* No Result */}
              {results.noResult && (
                <div className="text-center py-6 text-notion-textLight">
                  <p className="mb-2">❌ No good time found for this day</p>
                  <p className="text-sm mb-2">Try:</p>
                  <ul className="text-sm text-left max-w-md mx-auto space-y-1 text-notion-textLight">
                    <li>• Expanding working hours</li>
                    <li>• Checking another day</li>
                    <li>• Removing a participant</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
