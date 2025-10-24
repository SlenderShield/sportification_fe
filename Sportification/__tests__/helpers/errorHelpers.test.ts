import {
  getHttpError,
  getApiError,
  getValidationErrors,
  isNetworkError,
  isTimeoutError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isServerError,
  handleApiError,
  formatError,
  logError,
  retryOnError,
  mapErrorToMessage,
} from '@shared/helpers/errorHelpers';

describe('errorHelpers', () => {
  describe('getHttpError', () => {
    it('should get error message for status codes', () => {
      expect(getHttpError(400)).toContain('Bad Request');
      expect(getHttpError(401)).toContain('Unauthorized');
      expect(getHttpError(403)).toContain('Forbidden');
      expect(getHttpError(404)).toContain('Not Found');
      expect(getHttpError(500)).toContain('Server Error');
    });

    it('should handle unknown status codes', () => {
      expect(getHttpError(999)).toBeTruthy();
    });
  });

  describe('getApiError', () => {
    it('should extract error from API response', () => {
      const error = {
        response: {
          data: { message: 'API Error' },
        },
      };
      expect(getApiError(error)).toBe('API Error');
    });

    it('should handle errors without response', () => {
      const error = { message: 'Network Error' };
      expect(getApiError(error)).toBe('Network Error');
    });

    it('should handle unknown error format', () => {
      expect(getApiError('string error')).toBeTruthy();
    });
  });

  describe('getValidationErrors', () => {
    it('should extract validation errors', () => {
      const error = {
        response: {
          data: {
            errors: {
              email: ['Invalid email'],
              password: ['Too short'],
            },
          },
        },
      };
      const result = getValidationErrors(error);
      expect(result.email).toEqual(['Invalid email']);
      expect(result.password).toEqual(['Too short']);
    });

    it('should return empty object for non-validation errors', () => {
      const error = { message: 'Error' };
      expect(getValidationErrors(error)).toEqual({});
    });
  });

  describe('isNetworkError', () => {
    it('should detect network errors', () => {
      expect(isNetworkError({ message: 'Network Error' })).toBe(true);
      expect(isNetworkError({ code: 'ECONNABORTED' })).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isNetworkError({ message: 'Other error' })).toBe(false);
    });
  });

  describe('isTimeoutError', () => {
    it('should detect timeout errors', () => {
      expect(isTimeoutError({ code: 'ECONNABORTED' })).toBe(true);
      expect(isTimeoutError({ message: 'timeout' })).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isTimeoutError({ message: 'Other error' })).toBe(false);
    });
  });

  describe('isUnauthorizedError', () => {
    it('should detect 401 errors', () => {
      expect(isUnauthorizedError({ response: { status: 401 } })).toBe(true);
    });

    it('should return false for other status codes', () => {
      expect(isUnauthorizedError({ response: { status: 404 } })).toBe(false);
    });
  });

  describe('isForbiddenError', () => {
    it('should detect 403 errors', () => {
      expect(isForbiddenError({ response: { status: 403 } })).toBe(true);
    });

    it('should return false for other status codes', () => {
      expect(isForbiddenError({ response: { status: 404 } })).toBe(false);
    });
  });

  describe('isNotFoundError', () => {
    it('should detect 404 errors', () => {
      expect(isNotFoundError({ response: { status: 404 } })).toBe(true);
    });

    it('should return false for other status codes', () => {
      expect(isNotFoundError({ response: { status: 500 } })).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should detect 5xx errors', () => {
      expect(isServerError({ response: { status: 500 } })).toBe(true);
      expect(isServerError({ response: { status: 502 } })).toBe(true);
      expect(isServerError({ response: { status: 503 } })).toBe(true);
    });

    it('should return false for other status codes', () => {
      expect(isServerError({ response: { status: 404 } })).toBe(false);
    });
  });

  describe('handleApiError', () => {
    it('should handle API errors', () => {
      const error = { response: { status: 401 } };
      const result = handleApiError(error);
      expect(result.status).toBe(401);
      expect(result.message).toBeTruthy();
    });

    it('should handle network errors', () => {
      const error = { message: 'Network Error' };
      const result = handleApiError(error);
      expect(result.isNetworkError).toBe(true);
    });
  });

  describe('formatError', () => {
    it('should format error objects', () => {
      const error = new Error('Test error');
      const result = formatError(error);
      expect(result).toContain('Test error');
    });

    it('should format string errors', () => {
      expect(formatError('String error')).toBe('String error');
    });
  });

  describe('logError', () => {
    it('should log errors in development', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logError(new Error('Test'), 'Test context');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('retryOnError', () => {
    it('should retry on failure', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');

      const result = await retryOnError(fn, { maxAttempts: 3, delay: 10 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after max attempts', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('fail'));
      await expect(retryOnError(fn, { maxAttempts: 2, delay: 10 })).rejects.toThrow();
    });
  });

  describe('mapErrorToMessage', () => {
    it('should map errors to user-friendly messages', () => {
      expect(mapErrorToMessage({ response: { status: 404 } })).toBeTruthy();
      expect(mapErrorToMessage({ response: { status: 500 } })).toBeTruthy();
      expect(mapErrorToMessage({ message: 'Network Error' })).toBeTruthy();
    });

    it('should return generic message for unknown errors', () => {
      expect(mapErrorToMessage({})).toBeTruthy();
    });
  });
});
