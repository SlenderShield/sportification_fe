/**
 * String utility functions for common string operations
 */

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize the first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Convert string to title case
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'];
  
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !smallWords.includes(word)) {
        return capitalize(word);
      }
      return word;
    })
    .join(' ');
};

/**
 * Convert camelCase or PascalCase to readable text
 */
export const camelToReadable = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

/**
 * Convert snake_case to readable text
 */
export const snakeToReadable = (str: string): string => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Truncate string to specified length with ellipsis
 */
export const truncate = (str: string, maxLength: number, ellipsis: string = '...'): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - ellipsis.length) + ellipsis;
};

/**
 * Truncate string to specified number of words
 */
export const truncateWords = (str: string, maxWords: number, ellipsis: string = '...'): string => {
  if (!str) return '';
  const words = str.split(' ');
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(' ') + ellipsis;
};

/**
 * Remove extra whitespace from string
 */
export const normalizeWhitespace = (str: string): string => {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Check if string contains only digits
 */
export const isNumeric = (str: string): boolean => {
  if (!str) return false;
  return /^\d+$/.test(str);
};

/**
 * Check if string contains only letters
 */
export const isAlpha = (str: string): boolean => {
  if (!str) return false;
  return /^[a-zA-Z]+$/.test(str);
};

/**
 * Check if string contains only letters and numbers
 */
export const isAlphanumeric = (str: string): boolean => {
  if (!str) return false;
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Remove all non-alphanumeric characters
 */
export const removeNonAlphanumeric = (str: string): string => {
  if (!str) return '';
  return str.replace(/[^a-zA-Z0-9]/g, '');
};

/**
 * Convert string to slug (URL-friendly)
 */
export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Extract initials from name (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name: string, maxLength: number = 2): string => {
  if (!name) return '';
  
  const words = name.trim().split(/\s+/);
  const initials = words
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return initials.substring(0, maxLength);
};

/**
 * Mask sensitive data (e.g., email, phone)
 */
export const maskString = (str: string, visibleChars: number = 4, maskChar: string = '*'): string => {
  if (!str) return '';
  if (str.length <= visibleChars) return str;
  
  const visible = str.substring(0, visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars);
  return visible + masked;
};

/**
 * Mask email (e.g., "john.doe@example.com" -> "j***@example.com")
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const maskedUsername = username.charAt(0) + '***';
  return `${maskedUsername}@${domain}`;
};

/**
 * Format phone number (simple US format)
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Convert bytes to human-readable size
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Pluralize a word based on count
 */
export const pluralize = (word: string, count: number, plural?: string): string => {
  if (count === 1) return word;
  return plural || word + 's';
};

/**
 * Generate a random string of specified length
 */
export const randomString = (length: number = 10, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Compare two strings (case-insensitive)
 */
export const equalsIgnoreCase = (str1: string, str2: string): boolean => {
  if (!str1 || !str2) return str1 === str2;
  return str1.toLowerCase() === str2.toLowerCase();
};

/**
 * Check if string starts with substring (case-insensitive)
 */
export const startsWithIgnoreCase = (str: string, searchString: string): boolean => {
  if (!str || !searchString) return false;
  return str.toLowerCase().startsWith(searchString.toLowerCase());
};

/**
 * Check if string contains substring (case-insensitive)
 */
export const includesIgnoreCase = (str: string, searchString: string): boolean => {
  if (!str || !searchString) return false;
  return str.toLowerCase().includes(searchString.toLowerCase());
};

/**
 * Highlight matching text in a string (useful for search)
 */
export const highlightText = (text: string, query: string): string => {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};
