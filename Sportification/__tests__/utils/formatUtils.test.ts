import {
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatDuration,
  formatNumber,
  abbreviateNumber,
  formatPhoneNumber,
  formatAddress,
  formatRating,
  formatScore,
  formatDistance,
  formatOrdinal,
  formatList,
  formatPlural,
  formatRange,
} from '@shared/utils/formatUtils';

describe('formatUtils', () => {
  describe('formatCurrency', () => {
    it('should format currency with default USD', () => {
      expect(formatCurrency(1234.56)).toContain('1,234.56');
    });

    it('should format with different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBeTruthy();
      expect(formatCurrency(1234.56, 'GBP')).toBeTruthy();
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBeTruthy();
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-1234.56)).toBeTruthy();
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages', () => {
      expect(formatPercentage(0.5)).toContain('50');
    });

    it('should handle decimals', () => {
      expect(formatPercentage(0.333, 2)).toBeTruthy();
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBeTruthy();
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
    });

    it('should handle zero', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds', () => {
      expect(formatDuration(45)).toBe('45s');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(90)).toBe('1m 30s');
    });

    it('should format hours', () => {
      expect(formatDuration(3665)).toBe('1h 1m 5s');
    });

    it('should handle zero', () => {
      expect(formatDuration(0)).toBe('0s');
    });
  });

  describe('formatNumber', () => {
    it('should format with thousand separators', () => {
      expect(formatNumber(1234567)).toContain('1,234,567');
    });

    it('should format decimals', () => {
      expect(formatNumber(1234.5678, 2)).toBeTruthy();
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBeTruthy();
    });
  });

  describe('abbreviateNumber', () => {
    it('should abbreviate thousands', () => {
      expect(abbreviateNumber(1500)).toBe('1.5K');
    });

    it('should abbreviate millions', () => {
      expect(abbreviateNumber(1500000)).toBe('1.5M');
    });

    it('should abbreviate billions', () => {
      expect(abbreviateNumber(1500000000)).toBe('1.5B');
    });

    it('should not abbreviate small numbers', () => {
      expect(abbreviateNumber(500)).toBe('500');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format US phone numbers', () => {
      const result = formatPhoneNumber('1234567890');
      expect(result).toBeTruthy();
    });

    it('should handle phone with country code', () => {
      const result = formatPhoneNumber('+11234567890');
      expect(result).toBeTruthy();
    });

    it('should handle empty string', () => {
      expect(formatPhoneNumber('')).toBe('');
    });
  });

  describe('formatAddress', () => {
    it('should format complete address', () => {
      const address = {
        street: '123 Main St',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
        country: 'USA',
      };
      const result = formatAddress(address);
      expect(result).toContain('123 Main St');
      expect(result).toContain('Boston');
    });

    it('should handle partial address', () => {
      const address = { city: 'Boston', state: 'MA' };
      const result = formatAddress(address);
      expect(result).toContain('Boston');
    });
  });

  describe('formatRating', () => {
    it('should format rating with stars', () => {
      expect(formatRating(4.5)).toContain('4.5');
    });

    it('should handle max rating', () => {
      expect(formatRating(5)).toBeTruthy();
    });

    it('should handle zero rating', () => {
      expect(formatRating(0)).toBeTruthy();
    });
  });

  describe('formatScore', () => {
    it('should format scores', () => {
      expect(formatScore(10, 8)).toBe('10 - 8');
    });

    it('should handle zero scores', () => {
      expect(formatScore(0, 0)).toBe('0 - 0');
    });
  });

  describe('formatDistance', () => {
    it('should format meters', () => {
      expect(formatDistance(500)).toBe('500 m');
    });

    it('should format kilometers', () => {
      expect(formatDistance(1500)).toBe('1.5 km');
    });

    it('should handle zero', () => {
      expect(formatDistance(0)).toBe('0 m');
    });
  });

  describe('formatOrdinal', () => {
    it('should format 1st', () => {
      expect(formatOrdinal(1)).toBe('1st');
    });

    it('should format 2nd', () => {
      expect(formatOrdinal(2)).toBe('2nd');
    });

    it('should format 3rd', () => {
      expect(formatOrdinal(3)).toBe('3rd');
    });

    it('should format 4th', () => {
      expect(formatOrdinal(4)).toBe('4th');
    });

    it('should handle teens correctly', () => {
      expect(formatOrdinal(11)).toBe('11th');
      expect(formatOrdinal(12)).toBe('12th');
      expect(formatOrdinal(13)).toBe('13th');
    });
  });

  describe('formatList', () => {
    it('should format list with and', () => {
      expect(formatList(['A', 'B', 'C'])).toBe('A, B, and C');
    });

    it('should format list with or', () => {
      expect(formatList(['A', 'B'], 'or')).toBe('A or B');
    });

    it('should handle single item', () => {
      expect(formatList(['A'])).toBe('A');
    });

    it('should handle empty array', () => {
      expect(formatList([])).toBe('');
    });
  });

  describe('formatPlural', () => {
    it('should pluralize correctly', () => {
      expect(formatPlural(1, 'item')).toBe('1 item');
      expect(formatPlural(2, 'item')).toBe('2 items');
    });

    it('should use custom plural', () => {
      expect(formatPlural(2, 'child', 'children')).toBe('2 children');
    });

    it('should handle zero', () => {
      expect(formatPlural(0, 'item')).toBe('0 items');
    });
  });

  describe('formatRange', () => {
    it('should format number range', () => {
      expect(formatRange(10, 20)).toBe('10 - 20');
    });

    it('should handle same values', () => {
      expect(formatRange(10, 10)).toBeTruthy();
    });
  });
});
