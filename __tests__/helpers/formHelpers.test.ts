import {
  required,
  email,
  minLength,
  maxLength,
  pattern,
  url,
  phone,
  number,
  min,
  max,
  equals,
  validateForm,
  sanitizeInput,
  sanitizeHtml,
  trimFields,
  normalizePhone,
  normalizeEmail,
  buildQueryString,
  parseFormData,
  isFormValid,
  getFirstError,
} from '@shared/helpers/formHelpers';

describe('formHelpers', () => {
  describe('Validation Rules', () => {
    describe('required', () => {
      const validate = required('Field is required');

      it('should pass for non-empty values', () => {
        expect(validate('value')).toBeUndefined();
        expect(validate('0')).toBeUndefined();
      });

      it('should fail for empty values', () => {
        expect(validate('')).toBe('Field is required');
        expect(validate(null)).toBe('Field is required');
        expect(validate(undefined)).toBe('Field is required');
      });
    });

    describe('email', () => {
      const validate = email('Invalid email');

      it('should pass for valid emails', () => {
        expect(validate('test@example.com')).toBeUndefined();
        expect(validate('user.name@domain.co.uk')).toBeUndefined();
      });

      it('should fail for invalid emails', () => {
        expect(validate('invalid')).toBe('Invalid email');
        expect(validate('test@')).toBe('Invalid email');
        expect(validate('@example.com')).toBe('Invalid email');
      });

      it('should pass for empty values', () => {
        expect(validate('')).toBeUndefined();
      });
    });

    describe('minLength', () => {
      const validate = minLength(5, 'Too short');

      it('should pass for long enough strings', () => {
        expect(validate('12345')).toBeUndefined();
        expect(validate('123456')).toBeUndefined();
      });

      it('should fail for too short strings', () => {
        expect(validate('1234')).toBe('Too short');
      });
    });

    describe('maxLength', () => {
      const validate = maxLength(5, 'Too long');

      it('should pass for short enough strings', () => {
        expect(validate('12345')).toBeUndefined();
        expect(validate('1234')).toBeUndefined();
      });

      it('should fail for too long strings', () => {
        expect(validate('123456')).toBe('Too long');
      });
    });

    describe('pattern', () => {
      const validate = pattern(/^\d+$/, 'Must be numbers');

      it('should pass for matching patterns', () => {
        expect(validate('12345')).toBeUndefined();
      });

      it('should fail for non-matching patterns', () => {
        expect(validate('abc')).toBe('Must be numbers');
      });
    });

    describe('url', () => {
      const validate = url('Invalid URL');

      it('should pass for valid URLs', () => {
        expect(validate('https://example.com')).toBeUndefined();
        expect(validate('http://example.com/path')).toBeUndefined();
      });

      it('should fail for invalid URLs', () => {
        expect(validate('not a url')).toBe('Invalid URL');
      });
    });

    describe('phone', () => {
      const validate = phone('Invalid phone');

      it('should pass for valid phone numbers', () => {
        expect(validate('1234567890')).toBeUndefined();
        expect(validate('+11234567890')).toBeUndefined();
      });

      it('should fail for invalid phone numbers', () => {
        expect(validate('123')).toBe('Invalid phone');
      });
    });

    describe('number', () => {
      const validate = number('Must be a number');

      it('should pass for numbers', () => {
        expect(validate('123')).toBeUndefined();
        expect(validate('123.45')).toBeUndefined();
      });

      it('should fail for non-numbers', () => {
        expect(validate('abc')).toBe('Must be a number');
      });
    });

    describe('min', () => {
      const validate = min(10, 'Too small');

      it('should pass for values >= min', () => {
        expect(validate('10')).toBeUndefined();
        expect(validate('15')).toBeUndefined();
      });

      it('should fail for values < min', () => {
        expect(validate('5')).toBe('Too small');
      });
    });

    describe('max', () => {
      const validate = max(10, 'Too large');

      it('should pass for values <= max', () => {
        expect(validate('10')).toBeUndefined();
        expect(validate('5')).toBeUndefined();
      });

      it('should fail for values > max', () => {
        expect(validate('15')).toBe('Too large');
      });
    });

    describe('equals', () => {
      const validate = equals('password', 'Passwords must match');

      it('should pass for equal values', () => {
        expect(validate('password', { password: 'password' })).toBeUndefined();
      });

      it('should fail for different values', () => {
        expect(validate('different', { password: 'password' })).toBe('Passwords must match');
      });
    });
  });

  describe('validateForm', () => {
    it('should validate form with rules', () => {
      const data = { email: 'test@example.com', password: '12345' };
      const rules = {
        email: [required(), email()],
        password: [required(), minLength(8)],
      };

      const errors = validateForm(data, rules);
      expect(errors.email).toBeUndefined();
      expect(errors.password).toBeDefined();
    });

    it('should return empty errors for valid form', () => {
      const data = { email: 'test@example.com', password: '12345678' };
      const rules = {
        email: [required(), email()],
        password: [required(), minLength(8)],
      };

      const errors = validateForm(data, rules);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).not.toContain('<script>');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  text  ')).toBe('text');
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeHtml('<p>Hello</p>')).not.toContain('<p>');
    });
  });

  describe('trimFields', () => {
    it('should trim all string fields', () => {
      const data = { name: '  John  ', age: 30 };
      const result = trimFields(data);
      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
    });
  });

  describe('normalizePhone', () => {
    it('should normalize phone numbers', () => {
      expect(normalizePhone('(123) 456-7890')).toBe('1234567890');
    });
  });

  describe('normalizeEmail', () => {
    it('should normalize email addresses', () => {
      expect(normalizeEmail('Test@Example.COM')).toBe('test@example.com');
    });
  });

  describe('buildQueryString', () => {
    it('should build query string from object', () => {
      const result = buildQueryString({ a: '1', b: '2' });
      expect(result).toContain('a=1');
      expect(result).toContain('b=2');
    });

    it('should handle empty object', () => {
      expect(buildQueryString({})).toBe('');
    });
  });

  describe('parseFormData', () => {
    it('should parse form data', () => {
      const formData = new FormData();
      formData.append('name', 'John');
      formData.append('age', '30');

      const result = parseFormData(formData);
      expect(result.name).toBe('John');
      expect(result.age).toBe('30');
    });
  });

  describe('isFormValid', () => {
    it('should return true for valid forms', () => {
      expect(isFormValid({})).toBe(true);
    });

    it('should return false for invalid forms', () => {
      expect(isFormValid({ field: 'error' })).toBe(false);
    });
  });

  describe('getFirstError', () => {
    it('should get first error from errors object', () => {
      const errors = { field1: 'error1', field2: 'error2' };
      expect(getFirstError(errors)).toBe('error1');
    });

    it('should return null for no errors', () => {
      expect(getFirstError({})).toBeNull();
    });
  });
});
