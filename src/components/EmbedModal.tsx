import { useState, useRef } from 'react';
import type { City } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';
import { copyToClipboard } from '../utils/calendarUtils';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];
}

export const EmbedModal = ({ isOpen, onClose, cities }: EmbedModalProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [compact, setCompact] = useState(false);
  const [copied, setCopied] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, onClose, isOpen);

  if (!isOpen) return null;

  // Generate embed code
  const cityCodes = cities.map(c => c.code).join(',');
  const embedUrl = `https://mytimezone.online/embed?cities=${cityCodes}&theme=${theme}${compact ? '&compact=true' : ''}`;
  const embedCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="${compact ? '150' : '200'}"
  frameborder="0"
></iframe>`;

  const handleCopy = async () => {
    const success = await copyToClipboard(embedCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        {/* Modal */}
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-notion-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-notion-border"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-notion-border flex-shrink-0">
            <h2 className="text-lg font-semibold text-notion-text flex items-center gap-2">
              <span>&lt;/&gt;</span> Embed Widget
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
            {/* Preview Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-notion-text mb-3">Preview:</h3>
              <div className="border border-notion-border rounded-lg overflow-hidden bg-white">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height={compact ? '150' : '200'}
                  frameBorder="0"
                  style={{ display: 'block' }}
                  title="Embed preview"
                />
              </div>
            </div>

            {/* Options */}
            <div className="mb-6 space-y-4">
              {/* Theme Selector */}
              <div>
                <label className="block text-sm font-medium text-notion-text mb-2">
                  Theme:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={theme === 'light'}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                      className="w-4 h-4 text-notion-accent focus:ring-notion-accent"
                    />
                    <span className="text-sm text-notion-text">Light</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={theme === 'dark'}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                      className="w-4 h-4 text-notion-accent focus:ring-notion-accent"
                    />
                    <span className="text-sm text-notion-text">Dark</span>
                  </label>
                </div>
              </div>

              {/* Compact Checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={compact}
                    onChange={(e) => setCompact(e.target.checked)}
                    className="w-4 h-4 text-notion-accent focus:ring-notion-accent rounded border-notion-border"
                  />
                  <span className="text-sm text-notion-text">Compact (smaller height)</span>
                </label>
              </div>
            </div>

            {/* Code Snippet */}
            <div>
              <label className="block text-sm font-medium text-notion-text mb-2">
                Embed Code:
              </label>
              <div className="bg-[#F7F7F5] border border-notion-border rounded-lg p-4 mb-4">
                <pre className="text-xs font-mono text-notion-text whitespace-pre-wrap overflow-x-auto">
                  {embedCode}
                </pre>
              </div>
              <button
                onClick={handleCopy}
                className={`w-full py-2.5 px-4 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#191919] text-white hover:bg-[#333333]'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
