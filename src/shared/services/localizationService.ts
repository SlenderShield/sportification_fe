import { logger } from '@core';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@sportification:language';

// English translations
const en = {
  translation: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      search: 'Search',
      filter: 'Filter',
      retry: 'Retry',
      refresh: 'Refresh',
    },
    // Auth
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      loginWithGoogle: 'Login with Google',
      loginWithApple: 'Login with Apple',
      loginWithFacebook: 'Login with Facebook',
      biometricLogin: 'Login with {{type}}',
      enableBiometric: 'Enable biometric login',
    },
    // Matches
    matches: {
      title: 'Matches',
      createMatch: 'Create Match',
      matchDetails: 'Match Details',
      joinMatch: 'Join Match',
      leaveMatch: 'Leave Match',
      nearby: 'Nearby Matches',
      distance: '{{distance}} km away',
      participants: '{{current}}/{{max}} Players',
      sport: 'Sport',
      location: 'Location',
      dateTime: 'Date & Time',
      skillLevel: 'Skill Level',
      getDirections: 'Get Directions',
    },
    // Tournaments
    tournaments: {
      title: 'Tournaments',
      createTournament: 'Create Tournament',
      tournamentDetails: 'Tournament Details',
      joinTournament: 'Join Tournament',
      bracket: 'Bracket',
      standings: 'Standings',
      participants: 'Participants',
      rounds: 'Rounds',
    },
    // Teams
    teams: {
      title: 'Teams',
      createTeam: 'Create Team',
      teamDetails: 'Team Details',
      joinTeam: 'Join Team',
      leaveTeam: 'Leave Team',
      members: 'Members',
      captain: 'Captain',
      analytics: 'Analytics',
      winRate: 'Win Rate',
      matchHistory: 'Match History',
    },
    // Venues
    venues: {
      title: 'Venues',
      venueDetails: 'Venue Details',
      bookVenue: 'Book Venue',
      myBookings: 'My Bookings',
      checkAvailability: 'Check Availability',
      facilities: 'Facilities',
      pricing: 'Pricing',
      reviews: 'Reviews',
      getDirections: 'Get Directions',
      nearbyVenues: 'Nearby Venues',
      distance: '{{distance}} km away',
    },
    // Chat
    chat: {
      title: 'Chats',
      typeMessage: 'Type a message...',
      sendMessage: 'Send',
      noMessages: 'No messages yet',
      typing: '{{name}} is typing...',
    },
    // Payments
    payments: {
      title: 'Payments',
      payNow: 'Pay Now',
      paymentHistory: 'Payment History',
      amount: 'Amount',
      status: 'Status',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      paymentSuccessful: 'Payment Successful',
      paymentFailed: 'Payment Failed',
      processing: 'Processing payment...',
    },
    // Profile
    profile: {
      title: 'Profile',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
      friends: 'Friends',
      achievements: 'Achievements',
      stats: 'Stats',
      settings: 'Settings',
      language: 'Language',
      notifications: 'Notifications',
      privacy: 'Privacy',
    },
    // Notifications
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark All as Read',
      noNotifications: 'No notifications',
    },
    // Errors
    errors: {
      networkError: 'Network error. Please check your connection.',
      locationPermission: 'Location permission denied',
      biometricNotAvailable: 'Biometric authentication not available',
      paymentFailed: 'Payment failed. Please try again.',
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      passwordMismatch: 'Passwords do not match',
      weakPassword: 'Password is too weak',
    },
  },
};

// Hindi translations
const hi = {
  translation: {
    // Common
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      back: 'पीछे',
      next: 'अगला',
      submit: 'जमा करें',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      retry: 'पुनः प्रयास करें',
      refresh: 'ताज़ा करें',
    },
    // Auth
    auth: {
      login: 'लॉगिन',
      register: 'रजिस्टर',
      logout: 'लॉगआउट',
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      forgotPassword: 'पासवर्ड भूल गए?',
      dontHaveAccount: 'खाता नहीं है?',
      alreadyHaveAccount: 'पहले से खाता है?',
      loginWithGoogle: 'Google से लॉगिन करें',
      loginWithApple: 'Apple से लॉगिन करें',
      loginWithFacebook: 'Facebook से लॉगिन करें',
      biometricLogin: '{{type}} से लॉगिन करें',
      enableBiometric: 'बायोमेट्रिक लॉगिन सक्षम करें',
    },
    // Matches
    matches: {
      title: 'मैच',
      createMatch: 'मैच बनाएं',
      matchDetails: 'मैच विवरण',
      joinMatch: 'मैच में शामिल हों',
      leaveMatch: 'मैच छोड़ें',
      nearby: 'पास के मैच',
      distance: '{{distance}} किमी दूर',
      participants: '{{current}}/{{max}} खिलाड़ी',
      sport: 'खेल',
      location: 'स्थान',
      dateTime: 'तारीख और समय',
      skillLevel: 'कौशल स्तर',
      getDirections: 'दिशा-निर्देश प्राप्त करें',
    },
    // Tournaments
    tournaments: {
      title: 'टूर्नामेंट',
      createTournament: 'टूर्नामेंट बनाएं',
      tournamentDetails: 'टूर्नामेंट विवरण',
      joinTournament: 'टूर्नामेंट में शामिल हों',
      bracket: 'ब्रैकेट',
      standings: 'स्टैंडिंग',
      participants: 'प्रतिभागी',
      rounds: 'राउंड',
    },
    // Teams
    teams: {
      title: 'टीमें',
      createTeam: 'टीम बनाएं',
      teamDetails: 'टीम विवरण',
      joinTeam: 'टीम में शामिल हों',
      leaveTeam: 'टीम छोड़ें',
      members: 'सदस्य',
      captain: 'कप्तान',
      analytics: 'विश्लेषण',
      winRate: 'जीत दर',
      matchHistory: 'मैच इतिहास',
    },
    // Venues
    venues: {
      title: 'स्थल',
      venueDetails: 'स्थल विवरण',
      bookVenue: 'स्थल बुक करें',
      myBookings: 'मेरी बुकिंग',
      checkAvailability: 'उपलब्धता जांचें',
      facilities: 'सुविधाएं',
      pricing: 'मूल्य निर्धारण',
      reviews: 'समीक्षाएं',
      getDirections: 'दिशा-निर्देश प्राप्त करें',
      nearbyVenues: 'पास के स्थल',
      distance: '{{distance}} किमी दूर',
    },
    // Chat
    chat: {
      title: 'चैट',
      typeMessage: 'एक संदेश लिखें...',
      sendMessage: 'भेजें',
      noMessages: 'अभी तक कोई संदेश नहीं',
      typing: '{{name}} टाइप कर रहे हैं...',
    },
    // Payments
    payments: {
      title: 'भुगतान',
      payNow: 'अभी भुगतान करें',
      paymentHistory: 'भुगतान इतिहास',
      amount: 'राशि',
      status: 'स्थिति',
      cardNumber: 'कार्ड नंबर',
      expiryDate: 'समाप्ति तिथि',
      cvv: 'CVV',
      paymentSuccessful: 'भुगतान सफल',
      paymentFailed: 'भुगतान विफल',
      processing: 'भुगतान प्रोसेस हो रहा है...',
    },
    // Profile
    profile: {
      title: 'प्रोफ़ाइल',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      changePassword: 'पासवर्ड बदलें',
      friends: 'मित्र',
      achievements: 'उपलब्धियां',
      stats: 'आंकड़े',
      settings: 'सेटिंग्स',
      language: 'भाषा',
      notifications: 'सूचनाएं',
      privacy: 'गोपनीयता',
    },
    // Notifications
    notifications: {
      title: 'सूचनाएं',
      markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
      noNotifications: 'कोई सूचना नहीं',
    },
    // Errors
    errors: {
      networkError: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
      locationPermission: 'स्थान अनुमति अस्वीकृत',
      biometricNotAvailable: 'बायोमेट्रिक प्रमाणीकरण उपलब्ध नहीं है',
      paymentFailed: 'भुगतान विफल। कृपया पुनः प्रयास करें।',
      required: 'यह फ़ील्ड आवश्यक है',
      invalidEmail: 'अमान्य ईमेल पता',
      passwordMismatch: 'पासवर्ड मेल नहीं खाते',
      weakPassword: 'पासवर्ड बहुत कमजोर है',
    },
  },
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en,
    hi,
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

class LocalizationService {
  /**
   * Change app language
   */
  async changeLanguage(language: string): Promise<void> {
    try {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      logger.error('Error changing language:', error);
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return i18n.language;
  }

  /**
   * Load saved language preference
   */
  async loadLanguagePreference(): Promise<void> {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      logger.error('Error loading language preference:', error);
    }
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): Array<{ code: string; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    ];
  }
}

export const localizationService = new LocalizationService();
export { i18n };
