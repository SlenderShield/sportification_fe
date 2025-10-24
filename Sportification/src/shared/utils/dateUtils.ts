import { logger } from '@core';
import { format, formatDistance, formatRelative, parseISO, isValid, differenceInDays, differenceInHours, differenceInMinutes, addDays, addHours, addMinutes, startOfDay, endOfDay, isBefore, isAfter, isSameDay } from 'date-fns';

/**
 * @fileoverview Date utility functions for consistent date/time handling across the application.
 * 
 * This module provides a comprehensive set of date manipulation and formatting functions
 * built on top of date-fns. All functions handle both Date objects and ISO string inputs,
 * making them flexible for various use cases.
 * 
 * Key features:
 * - Consistent date formatting across the app
 * - Safe error handling with fallbacks
 * - Support for relative time formatting
 * - Date comparison and manipulation utilities
 * - Type-safe with TypeScript
 * 
 * @module dateUtils
 */

/**
 * Predefined date format patterns for consistent formatting across the application.
 * 
 * These constants follow date-fns format patterns and provide a centralized way
 * to ensure consistent date/time display throughout the UI.
 * 
 * @constant
 * @type {Readonly<Record<string, string>>}
 * 
 * @property {string} DISPLAY_DATE - User-friendly date format (e.g., "Jan 15, 2025")
 * @property {string} DISPLAY_DATE_TIME - Date with time (e.g., "Jan 15, 2025 • 3:30 PM")
 * @property {string} DISPLAY_TIME - 12-hour time format (e.g., "3:30 PM")
 * @property {string} SHORT_TIME - 24-hour time format (e.g., "15:30")
 * @property {string} ISO_DATE - ISO date format (e.g., "2025-01-15")
 * @property {string} ISO_DATE_TIME - ISO datetime format (e.g., "2025-01-15T15:30:00")
 * @property {string} FULL_DATE - Full month name format (e.g., "January 15, 2025")
 * @property {string} DAY_MONTH - Short month and day (e.g., "Jan 15")
 * 
 * @example
 * ```typescript
 * import { DATE_FORMATS, formatDate } from './dateUtils';
 * 
 * formatDate(new Date(), DATE_FORMATS.DISPLAY_DATE);  // "Jan 15, 2025"
 * formatDate(new Date(), DATE_FORMATS.ISO_DATE);      // "2025-01-15"
 * ```
 */
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
 * Format a date using a predefined or custom format pattern.
 * 
 * Accepts both Date objects and ISO date strings. If the date is invalid,
 * returns 'Invalid Date' instead of throwing an error.
 * 
 * @param {Date | string} date - The date to format (Date object or ISO string)
 * @param {string} [formatStr=DATE_FORMATS.DISPLAY_DATE] - Format pattern from DATE_FORMATS or custom pattern
 * @returns {string} Formatted date string or 'Invalid Date' if input is invalid
 * 
 * @example
 * ```typescript
 * formatDate(new Date('2025-01-15'));  // "Jan 15, 2025"
 * formatDate('2025-01-15T15:30:00');  // "Jan 15, 2025"
 * formatDate(new Date(), 'yyyy-MM-dd');  // "2025-01-15"
 * formatDate('invalid');  // "Invalid Date"
 * ```
 */
export const formatDate = (date: Date | string, formatStr: string = DATE_FORMATS.DISPLAY_DATE): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    return format(dateObj, formatStr);
  } catch (error) {
    logger.error('Error formatting date:', error instanceof Error ? error : undefined);
    return 'Invalid Date';
  }
};

/**
 * Format a date with time in a user-friendly format.
 * 
 * Convenience wrapper around formatDate that uses the DISPLAY_DATE_TIME format.
 * 
 * @param {Date | string} date - The date to format
 * @returns {string} Formatted datetime string (e.g., "Jan 15, 2025 • 3:30 PM")
 * 
 * @example
 * ```typescript
 * formatDateTime(new Date('2025-01-15T15:30:00'));  // "Jan 15, 2025 • 3:30 PM"
 * ```
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, DATE_FORMATS.DISPLAY_DATE_TIME);
};

/**
 * Format only the time portion of a date.
 * 
 * @param {Date | string} date - The date to extract time from
 * @param {boolean} [use24Hour=false] - If true, uses 24-hour format (15:30), otherwise 12-hour (3:30 PM)
 * @returns {string} Formatted time string
 * 
 * @example
 * ```typescript
 * formatTime(new Date('2025-01-15T15:30:00'));  // "3:30 PM"
 * formatTime(new Date('2025-01-15T15:30:00'), true);  // "15:30"
 * ```
 */
export const formatTime = (date: Date | string, use24Hour: boolean = false): string => {
  return formatDate(date, use24Hour ? DATE_FORMATS.SHORT_TIME : DATE_FORMATS.DISPLAY_TIME);
};

/**
 * Format a date as relative time from a base date.
 * 
 * Produces human-readable strings like "2 hours ago", "in 3 days", "about 1 month ago".
 * 
 * @param {Date | string} date - The date to format
 * @param {Date} [baseDate=new Date()] - The date to compare against (defaults to current time)
 * @returns {string} Relative time string or 'Invalid Date' if input is invalid
 * 
 * @example
 * ```typescript
 * const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
 * formatRelativeTime(twoHoursAgo);  // "2 hours ago"
 * 
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
 * formatRelativeTime(tomorrow);  // "in 1 day"
 * ```
 */
export const formatRelativeTime = (date: Date | string, baseDate: Date = new Date()): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    return formatDistance(dateObj, baseDate, { addSuffix: true });
  } catch (error) {
    logger.error('Error formatting relative time:', error instanceof Error ? error : undefined);
    return 'Invalid Date';
  }
};

/**
 * Format a date relative to another date with more natural language.
 * 
 * Produces strings like "last Friday at 3:50 PM", "tomorrow at 10:00 AM", "today at 2:30 PM".
 * 
 * @param {Date | string} date - The date to format
 * @param {Date} [baseDate=new Date()] - The date to compare against (defaults to current time)
 * @returns {string} Natural language date string or 'Invalid Date' if input is invalid
 * 
 * @example
 * ```typescript
 * formatRelativeDate(yesterday);  // "yesterday at 3:50 PM"
 * formatRelativeDate(tomorrow);   // "tomorrow at 10:00 AM"
 * ```
 */
export const formatRelativeDate = (date: Date | string, baseDate: Date = new Date()): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    return formatRelative(dateObj, baseDate);
  } catch (error) {
    logger.error('Error formatting relative date:', error instanceof Error ? error : undefined);
    return 'Invalid Date';
  }
};

/**
 * Check if a value is a valid date.
 * 
 * @param {Date | string} date - The value to validate
 * @returns {boolean} True if the date is valid, false otherwise
 * 
 * @example
 * ```typescript
 * isValidDate(new Date());  // true
 * isValidDate('2025-01-15');  // true
 * isValidDate('invalid');  // false
 * isValidDate(new Date('invalid'));  // false
 * ```
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
 * Parse an ISO date string into a Date object.
 * 
 * @param {string} dateString - ISO date string to parse
 * @returns {Date | null} Parsed Date object or null if invalid
 * 
 * @example
 * ```typescript
 * parseDate('2025-01-15T15:30:00');  // Date object
 * parseDate('2025-01-15');  // Date object
 * parseDate('invalid');  // null
 * ```
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
 * Calculate the number of full days between two dates.
 * 
 * @param {Date | string} date1 - The first date
 * @param {Date | string} [date2=new Date()] - The second date (defaults to current time)
 * @returns {number} Number of days between the dates (can be negative if date1 is before date2)
 * 
 * @example
 * ```typescript
 * const today = new Date('2025-01-15');
 * const nextWeek = new Date('2025-01-22');
 * getDaysDifference(nextWeek, today);  // 7
 * getDaysDifference(today, nextWeek);  // -7
 * getDaysDifference(nextWeek);  // Days until next week
 * ```
 */
export const getDaysDifference = (date1: Date | string, date2: Date | string = new Date()): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInDays(d1, d2);
};

/**
 * Calculate the number of full hours between two dates.
 * 
 * @param {Date | string} date1 - The first date
 * @param {Date | string} [date2=new Date()] - The second date (defaults to current time)
 * @returns {number} Number of hours between the dates
 * 
 * @example
 * ```typescript
 * const now = new Date();
 * const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
 * getHoursDifference(threeHoursLater, now);  // 3
 * ```
 */
export const getHoursDifference = (date1: Date | string, date2: Date | string = new Date()): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInHours(d1, d2);
};

/**
 * Calculate the number of full minutes between two dates.
 * 
 * @param {Date | string} date1 - The first date
 * @param {Date | string} [date2=new Date()] - The second date (defaults to current time)
 * @returns {number} Number of minutes between the dates
 * 
 * @example
 * ```typescript
 * const now = new Date();
 * const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
 * getMinutesDifference(thirtyMinutesLater, now);  // 30
 * ```
 */
export const getMinutesDifference = (date1: Date | string, date2: Date | string = new Date()): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInMinutes(d1, d2);
};

/**
 * Add a specified number of days to a date.
 * 
 * @param {Date | string} date - The starting date
 * @param {number} days - Number of days to add (can be negative to subtract)
 * @returns {Date} New date with days added
 * 
 * @example
 * ```typescript
 * const today = new Date('2025-01-15');
 * addDaysToDate(today, 7);  // Date for 2025-01-22
 * addDaysToDate(today, -7);  // Date for 2025-01-08
 * ```
 */
export const addDaysToDate = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, days);
};

/**
 * Add a specified number of hours to a date.
 * 
 * @param {Date | string} date - The starting date
 * @param {number} hours - Number of hours to add (can be negative to subtract)
 * @returns {Date} New date with hours added
 * 
 * @example
 * ```typescript
 * const now = new Date('2025-01-15T15:00:00');
 * addHoursToDate(now, 3);  // Date for 2025-01-15T18:00:00
 * ```
 */
export const addHoursToDate = (date: Date | string, hours: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addHours(dateObj, hours);
};

/**
 * Add a specified number of minutes to a date.
 * 
 * @param {Date | string} date - The starting date
 * @param {number} minutes - Number of minutes to add (can be negative to subtract)
 * @returns {Date} New date with minutes added
 * 
 * @example
 * ```typescript
 * const now = new Date('2025-01-15T15:00:00');
 * addMinutesToDate(now, 30);  // Date for 2025-01-15T15:30:00
 * ```
 */
export const addMinutesToDate = (date: Date | string, minutes: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addMinutes(dateObj, minutes);
};

/**
 * Get the start of day (midnight) for a given date.
 * 
 * @param {Date | string} [date=new Date()] - The date (defaults to current date)
 * @returns {Date} Date object set to 00:00:00.000
 * 
 * @example
 * ```typescript
 * const date = new Date('2025-01-15T15:30:00');
 * getStartOfDay(date);  // Date for 2025-01-15T00:00:00.000
 * getStartOfDay();  // Today at midnight
 * ```
 */
export const getStartOfDay = (date: Date | string = new Date()): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(dateObj);
};

/**
 * Get the end of day (last millisecond) for a given date.
 * 
 * @param {Date | string} [date=new Date()] - The date (defaults to current date)
 * @returns {Date} Date object set to 23:59:59.999
 * 
 * @example
 * ```typescript
 * const date = new Date('2025-01-15T15:30:00');
 * getEndOfDay(date);  // Date for 2025-01-15T23:59:59.999
 * ```
 */
export const getEndOfDay = (date: Date | string = new Date()): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfDay(dateObj);
};

/**
 * Check if a date is in the past (before current time).
 * 
 * @param {Date | string} date - The date to check
 * @returns {boolean} True if the date is before now
 * 
 * @example
 * ```typescript
 * isInPast(new Date('2020-01-01'));  // true
 * isInPast(new Date('2030-01-01'));  // false
 * ```
 */
export const isInPast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
};

/**
 * Check if a date is in the future (after current time).
 * 
 * @param {Date | string} date - The date to check
 * @returns {boolean} True if the date is after now
 * 
 * @example
 * ```typescript
 * isInFuture(new Date('2030-01-01'));  // true
 * isInFuture(new Date('2020-01-01'));  // false
 * ```
 */
export const isInFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(dateObj, new Date());
};

/**
 * Check if two dates fall on the same calendar day.
 * 
 * Ignores the time portion, only comparing year, month, and day.
 * 
 * @param {Date | string} date1 - The first date
 * @param {Date | string} date2 - The second date
 * @returns {boolean} True if both dates are on the same day
 * 
 * @example
 * ```typescript
 * const morning = new Date('2025-01-15T08:00:00');
 * const evening = new Date('2025-01-15T20:00:00');
 * const nextDay = new Date('2025-01-16T08:00:00');
 * 
 * isSameDayAs(morning, evening);  // true
 * isSameDayAs(morning, nextDay);  // false
 * ```
 */
export const isSameDayAs = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
};

/**
 * Check if a date is today.
 * 
 * Convenience function to check if a date is the same as the current day.
 * 
 * @param {Date | string} date - The date to check
 * @returns {boolean} True if the date is today
 * 
 * @example
 * ```typescript
 * isToday(new Date());  // true
 * isToday(new Date('2020-01-01'));  // false
 * ```
 */
export const isToday = (date: Date | string): boolean => {
  return isSameDayAs(date, new Date());
};

/**
 * Format a time range as a human-readable string.
 * 
 * @param {Date | string} startDate - The start time
 * @param {Date | string} endDate - The end time
 * @returns {string} Formatted time range (e.g., "2:00 PM - 4:00 PM")
 * 
 * @example
 * ```typescript
 * const start = new Date('2025-01-15T14:00:00');
 * const end = new Date('2025-01-15T16:00:00');
 * formatTimeRange(start, end);  // "2:00 PM - 4:00 PM"
 * ```
 */
export const formatTimeRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = formatTime(startDate);
  const end = formatTime(endDate);
  return `${start} - ${end}`;
};

/**
 * Format a date range as a human-readable string.
 * 
 * If both dates are on the same day, only shows one date.
 * Otherwise, shows a range like "Jan 15 - Jan 20, 2025".
 * 
 * @param {Date | string} startDate - The start date
 * @param {Date | string} endDate - The end date
 * @returns {string} Formatted date range
 * 
 * @example
 * ```typescript
 * const start = new Date('2025-01-15');
 * const end = new Date('2025-01-20');
 * formatDateRange(start, end);  // "Jan 15 - Jan 20, 2025"
 * 
 * const sameDay = new Date('2025-01-15');
 * formatDateRange(sameDay, sameDay);  // "Jan 15, 2025"
 * ```
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
