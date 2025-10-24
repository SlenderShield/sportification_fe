import {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  isValidDate,
  parseDate,
  getDaysDifference,
  getHoursDifference,
  addDaysToDate,
  isInPast,
  isInFuture,
  isToday,
  formatTimeRange,
  formatDateRange,
} from '@shared/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatDate(date);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    it('should handle string dates', () => {
      const result = formatDate('2025-01-15T14:30:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });

    it('should return "Invalid Date" for invalid input', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time together', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatDateTime(date);
      expect(result).toContain('2025');
      expect(result).toContain('Jan');
    });
  });

  describe('formatTime', () => {
    it('should format time in 12-hour format by default', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format time in 24-hour format when specified', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatTime(date, true);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(yesterday);
      expect(result).toContain('ago');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate('2025-01-15T14:30:00Z')).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isValidDate('invalid')).toBe(false);
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });
  });

  describe('parseDate', () => {
    it('should parse ISO date strings', () => {
      const result = parseDate('2025-01-15T14:30:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2025);
    });

    it('should return null for invalid dates', () => {
      const result = parseDate('invalid');
      expect(result).toBeNull();
    });
  });

  describe('getDaysDifference', () => {
    it('should calculate difference in days', () => {
      const date1 = new Date('2025-01-15');
      const date2 = new Date('2025-01-10');
      const result = getDaysDifference(date1, date2);
      expect(result).toBe(5);
    });
  });

  describe('getHoursDifference', () => {
    it('should calculate difference in hours', () => {
      const date1 = new Date('2025-01-15T14:00:00Z');
      const date2 = new Date('2025-01-15T10:00:00Z');
      const result = getHoursDifference(date1, date2);
      expect(result).toBe(4);
    });
  });

  describe('addDaysToDate', () => {
    it('should add days to a date', () => {
      const date = new Date('2025-01-15');
      const result = addDaysToDate(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle string dates', () => {
      const result = addDaysToDate('2025-01-15T00:00:00Z', 5);
      expect(result.getDate()).toBe(20);
    });
  });

  describe('isInPast', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isInPast(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(isInPast(futureDate)).toBe(false);
    });
  });

  describe('isInFuture', () => {
    it('should return true for future dates', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(isInFuture(futureDate)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isInFuture(pastDate)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for other dates', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('formatTimeRange', () => {
    it('should format time range', () => {
      const start = new Date('2025-01-15T14:00:00Z');
      const end = new Date('2025-01-15T16:00:00Z');
      const result = formatTimeRange(start, end);
      expect(result).toContain('-');
      expect(result.split('-').length).toBe(2);
    });
  });

  describe('formatDateRange', () => {
    it('should format date range for different days', () => {
      const start = new Date('2025-01-15T00:00:00Z');
      const end = new Date('2025-01-20T00:00:00Z');
      const result = formatDateRange(start, end);
      expect(result).toContain('-');
    });

    it('should format single day when dates are the same', () => {
      const date = new Date('2025-01-15T00:00:00Z');
      const result = formatDateRange(date, date);
      expect(result).not.toContain('-');
    });
  });
});
