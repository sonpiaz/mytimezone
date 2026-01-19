/**
 * Get flag emoji from country name
 * Returns flag emoji or 🌍 as fallback
 */
export const getFlagEmoji = (country: string): string => {
  const flags: Record<string, string> = {
    // United States
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'US': '🇺🇸',
    
    // United Kingdom
    'United Kingdom': '🇬🇧',
    'UK': '🇬🇧',
    
    // Asia
    'Singapore': '🇸🇬',
    'Japan': '🇯🇵',
    'Vietnam': '🇻🇳',
    'China': '🇨🇳',
    'India': '🇮🇳',
    'South Korea': '🇰🇷',
    'Thailand': '🇹🇭',
    'Malaysia': '🇲🇾',
    'Indonesia': '🇮🇩',
    'Philippines': '🇵🇭',
    'Taiwan': '🇹🇼',
    'Hong Kong': '🇭🇰',
    
    // Europe
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Netherlands': '🇳🇱',
    'Belgium': '🇧🇪',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'Sweden': '🇸🇪',
    'Norway': '🇳🇴',
    'Denmark': '🇩🇰',
    'Finland': '🇫🇮',
    'Poland': '🇵🇱',
    'Russia': '🇷🇺',
    'Turkey': '🇹🇷',
    'Greece': '🇬🇷',
    'Portugal': '🇵🇹',
    'Ireland': '🇮🇪',
    
    // Americas
    'Canada': '🇨🇦',
    'Mexico': '🇲🇽',
    'Brazil': '🇧🇷',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱',
    'Colombia': '🇨🇴',
    'Peru': '🇵🇪',
    'Venezuela': '🇻🇪',
    
    // Oceania
    'Australia': '🇦🇺',
    'New Zealand': '🇳🇿',
    
    // Middle East & Africa
    'United Arab Emirates': '🇦🇪',
    'UAE': '🇦🇪',
    'Saudi Arabia': '🇸🇦',
    'Israel': '🇮🇱',
    'Egypt': '🇪🇬',
    'South Africa': '🇿🇦',
    'Kenya': '🇰🇪',
    'Nigeria': '🇳🇬',
    
    // Other
    'American Samoa': '🇦🇸',
  };
  
  return flags[country] || '🌍';
};
