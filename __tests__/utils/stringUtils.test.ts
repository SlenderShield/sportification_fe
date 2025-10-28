import {
  capitalize,
  capitalizeWords,
  toTitleCase,
  truncate,
  truncateWords,
  normalizeWhitespace,
  isNumeric,
  isAlpha,
  isAlphanumeric,
  slugify,
  getInitials,
  maskEmail,
  formatPhoneNumber,
  pluralize,
  isEmpty,
  equalsIgnoreCase,
  includesIgnoreCase,
} from '@shared/utils/stringUtils';

describe('stringUtils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should handle small words correctly', () => {
      const result = toTitleCase('a tale of two cities');
      expect(result).toContain('Tale');
      expect(result).toContain('Cities');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const result = truncate('This is a long string', 10);
      expect(result).toBe('This is...');
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should not truncate short strings', () => {
      const result = truncate('Short', 10);
      expect(result).toBe('Short');
    });

    it('should use custom ellipsis', () => {
      const result = truncate('Long string here', 8, '---');
      expect(result).toContain('---');
    });
  });

  describe('truncateWords', () => {
    it('should truncate by word count', () => {
      const result = truncateWords('One two three four five', 3);
      expect(result).toBe('One two three...');
    });

    it('should not truncate if under limit', () => {
      const result = truncateWords('One two', 3);
      expect(result).toBe('One two');
    });
  });

  describe('normalizeWhitespace', () => {
    it('should remove extra whitespace', () => {
      expect(normalizeWhitespace('  hello   world  ')).toBe('hello world');
      expect(normalizeWhitespace('hello\n\nworld')).toBe('hello world');
    });
  });

  describe('isNumeric', () => {
    it('should return true for numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });

    it('should return false for non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('12a')).toBe(false);
      expect(isNumeric('')).toBe(false);
    });
  });

  describe('isAlpha', () => {
    it('should return true for alphabetic strings', () => {
      expect(isAlpha('abc')).toBe(true);
      expect(isAlpha('ABC')).toBe(true);
    });

    it('should return false for non-alphabetic strings', () => {
      expect(isAlpha('abc123')).toBe(false);
      expect(isAlpha('123')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should return true for alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC123')).toBe(true);
    });

    it('should return false for strings with special characters', () => {
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });

    it('should handle special characters', () => {
      expect(slugify('Test@#$%String')).toBe('teststring');
    });
  });

  describe('getInitials', () => {
    it('should extract initials', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    it('should respect max length', () => {
      expect(getInitials('John Michael Doe', 3)).toBe('JMD');
    });

    it('should handle single names', () => {
      expect(getInitials('John')).toBe('J');
    });
  });

  describe('maskEmail', () => {
    it('should mask email addresses', () => {
      expect(maskEmail('john.doe@example.com')).toBe('j***@example.com');
      expect(maskEmail('test@example.com')).toBe('t***@example.com');
    });

    it('should handle short usernames', () => {
      const result = maskEmail('ab@example.com');
      expect(result).toContain('@example.com');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format US phone numbers', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });

    it('should handle non-10-digit numbers', () => {
      const result = formatPhoneNumber('123');
      expect(result).toBe('123');
    });
  });

  describe('pluralize', () => {
    it('should pluralize correctly', () => {
      expect(pluralize('cat', 1)).toBe('cat');
      expect(pluralize('cat', 2)).toBe('cats');
      expect(pluralize('cat', 0)).toBe('cats');
    });

    it('should use custom plural form', () => {
      expect(pluralize('child', 2, 'children')).toBe('children');
    });
  });

  describe('isEmpty', () => {
    it('should detect empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });
  });

  describe('equalsIgnoreCase', () => {
    it('should compare strings case-insensitively', () => {
      expect(equalsIgnoreCase('Hello', 'hello')).toBe(true);
      expect(equalsIgnoreCase('WORLD', 'world')).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(equalsIgnoreCase('hello', 'world')).toBe(false);
    });
  });

  describe('includesIgnoreCase', () => {
    it('should check substring case-insensitively', () => {
      expect(includesIgnoreCase('Hello World', 'world')).toBe(true);
      expect(includesIgnoreCase('HELLO WORLD', 'hello')).toBe(true);
    });

    it('should return false when substring not found', () => {
      expect(includesIgnoreCase('hello', 'world')).toBe(false);
    });
  });
});
