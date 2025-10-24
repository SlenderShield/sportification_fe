import { logger } from '@core';
import { format, formatDistance, formatRelative, parseISO, isValid, differenceInDays, differenceInHours, differenceInMinutes, addDays, addHours, addMinutes, startOfDay, endOfDay, isBefore, isAfter, isSameDay } from 'date-fns';

/**
 * Date utility functions for consistent date handling across the app
 */

// Common date format patterns
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_DATE_TIME: 'MMM dd, yyyy • h:mm a',
  DISPLAY_TIME: 'h:mm a',
  SHORT_TIME: 'HH:mm',
  ISO_DATE: 'yyyy-MM-dd',
  ISO_DATE_TIME: "yyyy-MM-dd'T'HH:mm:ss",
  FULL_DATE: 'MMMM dd, yyyy',
  DAY_MONTH: 'MMM dd',
} as const;

/**
 * Format a date using a predefined format
 */
export const formatDate = (date: Date | string, formatStr: string = DATE_FORMATS.DISPLAY_DATE): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    return format(dateObj, formatStr);
  } catch (error) {
    logger.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a date and time together
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, DATE_FORMATS.DISPLAY_DATE_TIME);
};

/**
 * Format time only
 */
export const formatTime = (date: Date | string, use24Hour: boolean = false): string => {
  return formatDate(date, use24Hour ? DATE_FORMATS.SHORT_TIME : DATE_FORMATS.DISPLAY_TIME);
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (date: Date | string, baseDate: Date = new Date()): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    return formatDistance(dateObj, baseDate, { addSuffix: true });
  } catch (error) {
    logger.error('Error formatting relative time:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date relative to now (e.g., "last Friday at 3:50 PM")
 */
export const formatRelativeDate = (date: Date | string, baseDate: Date = new Date()): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    return formatRelative(dateObj, baseDate);
  } catch (error) {
    logger.error('Error formatting relative date:', error);
    return 'Invalid Date';
  }
};

/**
 * Check if a date is valid
 */
export const isValidDate = (date: Date | string): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  } catch {
    return false;
  }
};

/**
 * Parse ISO string to Date
 */
export const parseDate = (dateString: string): Date | null => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};

/**
 * Get difference between two dates in days
 */
export const getDaysDifference = (date1: Date | string, date2: Date | string = new Date()): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInDays(d1, d2);
};

/**
 * Get difference between two dates in hours
 */
export const getHoursDifference = (date1: Date | string, date2: Date | string = new Date()): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInHours(d1, d2);
};

/**
 * Get difference between two dates in minutes
 */
export const getMinutesDifference = (date1: Date | string, date2: Date | string = new Date()): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInMinutes(d1, d2);
};

/**
 * Add days to a date
 */
export const addDaysToDate = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, days);
};

/**
 * Add hours to a date
 */
export const addHoursToDate = (date: Date | string, hours: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addHours(dateObj, hours);
};

/**
 * Add minutes to a date
 */
export const addMinutesToDate = (date: Date | string, minutes: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addMinutes(dateObj, minutes);
};

/**
 * Get start of day
 */
export const getStartOfDay = (date: Date | string = new Date()): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(dateObj);
};

/**
 * Get end of day
 */
export const getEndOfDay = (date: Date | string = new Date()): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfDay(dateObj);
};

/**
 * Check if date is in the past
 */
export const isInPast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
};

/**
 * Check if date is in the future
 */
export const isInFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(dateObj, new Date());
};

/**
 * Check if two dates are on the same day
 */
export const isSameDayAs = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  return isSameDayAs(date, new Date());
};

/**
 * Get a human-readable time range (e.g., "2:00 PM - 4:00 PM")
 */
export const formatTimeRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = formatTime(startDate);
  const end = formatTime(endDate);
  return `${start} - ${end}`;
};

/**
 * Get a human-readable date range (e.g., "Jan 15 - Jan 20, 2025")
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (isSameDay(start, end)) {
    return formatDate(start, DATE_FORMATS.DISPLAY_DATE);
  }
  
  const startStr = formatDate(start, DATE_FORMATS.DAY_MONTH);
  const endStr = formatDate(end, DATE_FORMATS.DISPLAY_DATE);
  return `${startStr} - ${endStr}`;
};
