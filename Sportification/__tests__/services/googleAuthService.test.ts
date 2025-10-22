import { googleAuthService } from '../../src/services/googleAuthService';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    revokeAccess: jest.fn(),
    isSignedIn: jest.fn(),
    getCurrentUser: jest.fn(),
    getTokens: jest.fn(),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('GoogleAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('configure', () => {
    it('should configure Google Sign-In', () => {
      const webClientId = 'test-client-id.apps.googleusercontent.com';

      googleAuthService.configure(webClientId);

      expect(GoogleSignin.configure).toHaveBeenCalledWith({
        webClientId,
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
        accountName: '',
        iosClientId: undefined,
        scopes: ['profile', 'email'],
      });
    });

    it('should not configure twice', () => {
      const webClientId = 'test-client-id.apps.googleusercontent.com';

      googleAuthService.configure(webClientId);
      googleAuthService.configure(webClientId);

      expect(GoogleSignin.configure).toHaveBeenCalledTimes(1);
    });
  });

  describe('hasPlayServices', () => {
    it('should return true on iOS', async () => {
      Platform.OS = 'ios' as any;

      const result = await googleAuthService.hasPlayServices();

      expect(result).toBe(true);
      expect(GoogleSignin.hasPlayServices).not.toHaveBeenCalled();
    });

    it('should check Play Services on Android', async () => {
      Platform.OS = 'android' as any;
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);

      const result = await googleAuthService.hasPlayServices();

      expect(result).toBe(true);
      expect(GoogleSignin.hasPlayServices).toHaveBeenCalledWith({
        showPlayServicesUpdateDialog: true,
      });
    });

    it('should return false when Play Services not available', async () => {
      Platform.OS = 'android' as any;
      (GoogleSignin.hasPlayServices as jest.Mock).mockRejectedValue(
        new Error('Not available')
      );

      const result = await googleAuthService.hasPlayServices();

      expect(result).toBe(false);
    });
  });

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      const mockUserInfo = {
        data: {
          idToken: 'test-id-token',
          user: {
            id: 'user123',
            name: 'Test User',
            email: 'test@example.com',
            photo: 'https://example.com/photo.jpg',
            givenName: 'Test',
            familyName: 'User',
          },
        },
      };

      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockResolvedValue(mockUserInfo);

      const result = await googleAuthService.signIn();

      expect(result).not.toBeNull();
      expect(result?.idToken).toBe('test-id-token');
      expect(result?.user.id).toBe('user123');
      expect(result?.user.email).toBe('test@example.com');
    });

    it('should return null when user cancels', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockRejectedValue({
        code: statusCodes.SIGN_IN_CANCELLED,
      });

      const result = await googleAuthService.signIn();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('User cancelled sign in');
      consoleSpy.mockRestore();
    });

    it('should return null when sign in already in progress', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockRejectedValue({
        code: statusCodes.IN_PROGRESS,
      });

      const result = await googleAuthService.signIn();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Sign in already in progress');
      consoleSpy.mockRestore();
    });

    it('should return null when no ID token received', async () => {
      const mockUserInfo = {
        data: {
          idToken: null,
          user: {
            id: 'user123',
            name: 'Test User',
            email: 'test@example.com',
            photo: null,
            givenName: 'Test',
            familyName: 'User',
          },
        },
      };

      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockResolvedValue(mockUserInfo);

      const result = await googleAuthService.signIn();

      expect(result).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      (GoogleSignin.signOut as jest.Mock).mockResolvedValue(undefined);

      await googleAuthService.signOut();

      expect(GoogleSignin.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (GoogleSignin.signOut as jest.Mock).mockRejectedValue(new Error('Sign out error'));

      await googleAuthService.signOut();

      expect(consoleSpy).toHaveBeenCalledWith('Google Sign-Out error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('revokeAccess', () => {
    it('should revoke access successfully', async () => {
      (GoogleSignin.revokeAccess as jest.Mock).mockResolvedValue(undefined);

      await googleAuthService.revokeAccess();

      expect(GoogleSignin.revokeAccess).toHaveBeenCalled();
    });

    it('should handle revoke errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (GoogleSignin.revokeAccess as jest.Mock).mockRejectedValue(new Error('Revoke error'));

      await googleAuthService.revokeAccess();

      expect(consoleSpy).toHaveBeenCalledWith('Google revoke access error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('isSignedIn', () => {
    it('should return true when signed in', async () => {
      (GoogleSignin.isSignedIn as jest.Mock).mockResolvedValue(true);

      const result = await googleAuthService.isSignedIn();

      expect(result).toBe(true);
    });

    it('should return false when not signed in', async () => {
      (GoogleSignin.isSignedIn as jest.Mock).mockResolvedValue(false);

      const result = await googleAuthService.isSignedIn();

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (GoogleSignin.isSignedIn as jest.Mock).mockRejectedValue(new Error('Check error'));

      const result = await googleAuthService.isSignedIn();

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockUserInfo = {
        data: {
          idToken: 'test-id-token',
          user: {
            id: 'user123',
            name: 'Test User',
            email: 'test@example.com',
            photo: 'https://example.com/photo.jpg',
            givenName: 'Test',
            familyName: 'User',
          },
        },
      };

      (GoogleSignin.getCurrentUser as jest.Mock).mockResolvedValue(mockUserInfo);

      const result = await googleAuthService.getCurrentUser();

      expect(result).not.toBeNull();
      expect(result?.user.email).toBe('test@example.com');
    });

    it('should return null when no user', async () => {
      (GoogleSignin.getCurrentUser as jest.Mock).mockResolvedValue(null);

      const result = await googleAuthService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('getTokens', () => {
    it('should return tokens', async () => {
      const mockTokens = {
        idToken: 'test-id-token',
        accessToken: 'test-access-token',
      };

      (GoogleSignin.getTokens as jest.Mock).mockResolvedValue(mockTokens);

      const result = await googleAuthService.getTokens();

      expect(result).toEqual(mockTokens);
    });

    it('should return null on error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (GoogleSignin.getTokens as jest.Mock).mockRejectedValue(new Error('Token error'));

      const result = await googleAuthService.getTokens();

      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });
});
