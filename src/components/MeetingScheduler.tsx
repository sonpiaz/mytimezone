import { useState, useEffect } from 'react';
import type { City } from '../types';
import type { Participant, WorkingHours, SchedulerResult } from '../types/meetingScheduler';
import { findBestMeetingTimes } from '../utils/meetingScheduler';
import { ResultSection } from './ResultSection';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];  // Current cities from timeline
  onCopy?: () => void;
}

export const MeetingScheduler = ({ isOpen, onClose, cities, onCopy }: MeetingSchedulerProps) => {
  // State
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours>({ start: 9, end: 18 });
  const [duration, setDuration] = useState(1); // 1 hour
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [results, setResults] = useState<SchedulerResult | null>(null);

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
      <div className="bg-white rounded-lg shadow-notion-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-notion-border">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-notion-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-notion-text flex items-center gap-2">
            🎯 Find Best Meeting Time
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
              Participants:
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
                    px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-notion
                    ${p.isSelected
                      ? p.isHost
                        ? 'bg-notion-accent text-white'
                        : 'bg-notion-accentLight text-notion-accent border border-notion-accent/20'
                      : 'bg-notion-hover text-notion-textLight border border-notion-border'
                    }
                  `}
                >
                  {p.isHost && <span>🏠</span>}
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
              <p className="text-xs text-red-500 mt-2">Please select at least 2 participants</p>
            )}
          </div>

          {/* Working Hours */}
          <div className="mb-4">
            <label className="text-sm font-medium text-notion-text mb-2 block">
              Working hours:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={workingHours.start}
                onChange={(e) => setWorkingHours(prev => ({ ...prev, start: Number(e.target.value) }))}
                className="px-3 py-2 border border-notion-border rounded-lg text-sm text-notion-text bg-white hover:bg-notion-hover transition-notion"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
              <span className="text-notion-textLight">to</span>
              <select
                value={workingHours.end}
                onChange={(e) => setWorkingHours(prev => ({ ...prev, end: Number(e.target.value) }))}
                className="px-3 py-2 border border-notion-border rounded-lg text-sm text-notion-text bg-white hover:bg-notion-hover transition-notion"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="text-sm font-medium text-notion-text mb-2 block">
              Meeting duration:
            </label>
            <div className="flex gap-2">
              {[0.5, 1, 1.5, 2].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`
                    px-4 py-2 rounded-lg text-sm transition-notion
                    ${duration === d
                      ? 'bg-notion-text text-white'
                      : 'bg-notion-hover text-notion-textLight hover:bg-notion-border'
                    }
                  `}
                >
                  {d === 0.5 ? '30 min' : `${d} hr`}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-notion-text mb-2 block">
              Date:
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
              w-full py-3 bg-notion-accent text-white rounded-lg font-medium 
              flex items-center justify-center gap-2 transition-notion
              ${selectedCount < 2
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:opacity-90'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Best Times
          </button>

          {/* Results */}
          {results && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-notion-text mb-4">
                📅 Results for {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>

              {/* Perfect Slots */}
              {results.perfect.length > 0 && (
                <ResultSection
                  title={`✅ PERFECT (${results.perfect.length} ${results.perfect.length === 1 ? 'slot' : 'slots'})`}
                  slots={results.perfect}
                  variant="perfect"
                  onCopy={onCopy}
                />
              )}

              {/* Sacrifice Slots */}
              {results.sacrifice.length > 0 && (
                <ResultSection
                  title={`⚠️ SOME SACRIFICE (${results.sacrifice.length} ${results.sacrifice.length === 1 ? 'slot' : 'slots'})`}
                  slots={results.sacrifice}
                  variant="sacrifice"
                  onCopy={onCopy}
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
