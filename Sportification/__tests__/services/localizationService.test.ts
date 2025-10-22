import { localizationService, i18n } from '../../src/services/localizationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockReturnThis(),
  changeLanguage: jest.fn(),
  language: 'en',
}));

jest.mock('react-i18next', () => ({
  initReactI18next: {},
}));

describe('LocalizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('changeLanguage', () => {
    it('should change language and save to storage', async () => {
      (i18n.changeLanguage as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await localizationService.changeLanguage('hi');

      expect(i18n.changeLanguage).toHaveBeenCalledWith('hi');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@sportification:language', 'hi');
    });

    it('should handle language change errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (i18n.changeLanguage as jest.Mock).mockRejectedValue(new Error('Change error'));

      await localizationService.changeLanguage('hi');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error changing language:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it('should handle storage errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (i18n.changeLanguage as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await localizationService.changeLanguage('hi');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getCurrentLanguage', () => {
    it('should return current language', () => {
      (i18n.language as any) = 'en';

      const language = localizationService.getCurrentLanguage();

      expect(language).toBe('en');
    });

    it('should return different language after change', () => {
      (i18n.language as any) = 'hi';

      const language = localizationService.getCurrentLanguage();

      expect(language).toBe('hi');
    });
  });

  describe('loadLanguagePreference', () => {
    it('should load saved language preference', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('hi');
      (i18n.changeLanguage as jest.Mock).mockResolvedValue(undefined);

      await localizationService.loadLanguagePreference();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@sportification:language');
      expect(i18n.changeLanguage).toHaveBeenCalledWith('hi');
    });

    it('should not change language if no preference saved', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await localizationService.loadLanguagePreference();

      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(i18n.changeLanguage).not.toHaveBeenCalled();
    });

    it('should handle loading errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Load error'));

      await localizationService.loadLanguagePreference();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading language preference:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('getAvailableLanguages', () => {
    it('should return list of available languages', () => {
      const languages = localizationService.getAvailableLanguages();

      expect(languages).toHaveLength(2);
      expect(languages).toContainEqual({
        code: 'en',
        name: 'English',
        nativeName: 'English',
      });
      expect(languages).toContainEqual({
        code: 'hi',
        name: 'Hindi',
        nativeName: 'हिन्दी',
      });
    });

    it('should return array with correct structure', () => {
      const languages = localizationService.getAvailableLanguages();

      languages.forEach((lang) => {
        expect(lang).toHaveProperty('code');
        expect(lang).toHaveProperty('name');
        expect(lang).toHaveProperty('nativeName');
        expect(typeof lang.code).toBe('string');
        expect(typeof lang.name).toBe('string');
        expect(typeof lang.nativeName).toBe('string');
      });
    });
  });
});
