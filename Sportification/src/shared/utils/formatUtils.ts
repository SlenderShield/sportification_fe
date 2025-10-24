/**
 * Formatting utility functions for common formatting operations
 */

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD', showSymbol: boolean = true): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
  
  if (!showSymbol) {
    return formatted.replace(/[^0-9.,-]/g, '').trim();
  }
  
  return formatted;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Format duration in seconds to readable format (e.g., "2h 30m", "45s")
 */
export const formatDuration = (seconds: number, showSeconds: boolean = true): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  
  if ((showSeconds && secs > 0) || parts.length === 0) {
    parts.push(`${secs}s`);
  }
  
  return parts.join(' ');
};

/**
 * Format count with K, M, B suffix
 */
export const formatCount = (count: number, decimals: number = 1): string => {
  if (count < 1000) {
    return count.toString();
  }
  
  if (count < 1000000) {
    return (count / 1000).toFixed(decimals) + 'K';
  }
  
  if (count < 1000000000) {
    return (count / 1000000).toFixed(decimals) + 'M';
  }
  
  return (count / 1000000000).toFixed(decimals) + 'B';
};

/**
 * Format score (e.g., "21-15", "3-0")
 */
export const formatScore = (team1Score: number, team2Score: number, separator: string = '-'): string => {
  return `${team1Score}${separator}${team2Score}`;
};

/**
 * Format list with commas and "and" (e.g., "Alice, Bob, and Charlie")
 */
export const formatList = (items: string[], conjunction: string = 'and'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(', ');
  return `${otherItems}, ${conjunction} ${lastItem}`;
};

/**
 * Format ordinal number (e.g., 1st, 2nd, 3rd, 4th)
 */
export const formatOrdinal = (num: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
};

/**
 * Format credit card number (mask and format)
 */
export const formatCreditCard = (cardNumber: string, maskAll: boolean = false): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (maskAll) {
    const lastFour = cleaned.slice(-4);
    const masked = '•'.repeat(cleaned.length - 4);
    return `${masked}${lastFour}`.match(/.{1,4}/g)?.join(' ') || cardNumber;
  }
  
  return cleaned.match(/.{1,4}/g)?.join(' ') || cardNumber;
};

/**
 * Format distance in meters
 */
export const formatDistance = (meters: number, useKm: boolean = true): string => {
  if (meters < 1000 || !useKm) {
    return `${Math.round(meters)}m`;
  }
  
  const km = meters / 1000;
  return `${km.toFixed(1)}km`;
};

/**
 * Format speed (m/s to km/h or mph)
 */
export const formatSpeed = (metersPerSecond: number, unit: 'kmh' | 'mph' = 'kmh'): string => {
  if (unit === 'kmh') {
    const kmh = metersPerSecond * 3.6;
    return `${kmh.toFixed(1)} km/h`;
  }
  
  const mph = metersPerSecond * 2.237;
  return `${mph.toFixed(1)} mph`;
};

/**
 * Format coordinates (latitude, longitude)
 */
export const formatCoordinates = (lat: number, lng: number, decimals: number = 6): string => {
  return `${lat.toFixed(decimals)}, ${lng.toFixed(decimals)}`;
};

/**
 * Format version number (e.g., "1.2.3")
 */
export const formatVersion = (major: number, minor: number, patch: number): string => {
  return `${major}.${minor}.${patch}`;
};

/**
 * Format name (capitalize first and last name)
 */
export const formatName = (firstName: string, lastName: string): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};

/**
 * Format address on multiple lines
 */
export const formatAddress = (
  street: string,
  city: string,
  state: string,
  zipCode: string,
  country?: string
): string => {
  const parts = [
    street,
    `${city}, ${state} ${zipCode}`,
  ];
  
  if (country) {
    parts.push(country);
  }
  
  return parts.join('\n');
};

/**
 * Format compact number for display (e.g., 1.2K instead of 1234)
 */
export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};

/**
 * Format rating (e.g., "4.5 ★" or "4.5/5")
 */
export const formatRating = (rating: number, outOf: number = 5, useStars: boolean = true): string => {
  if (useStars) {
    return `${rating.toFixed(1)} ★`;
  }
  return `${rating.toFixed(1)}/${outOf}`;
};

/**
 * Format participant count (e.g., "5/10 players")
 */
export const formatParticipantCount = (current: number, max: number, label: string = 'players'): string => {
  return `${current}/${max} ${label}`;
};
