import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

export interface GoogleUser {
  idToken: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
    givenName: string | null;
    familyName: string | null;
  };
}

class GoogleAuthService {
  private initialized = false;

  /**
   * Configure Google Sign-In
   */
  configure(webClientId: string): void {
    if (this.initialized) return;

    try {
      GoogleSignin.configure({
        webClientId, // From Google Cloud Console
        offlineAccess: true,
        hostedDomain: '', // Optional: specify domain
        forceCodeForRefreshToken: true,
        accountName: '', // Optional: Android only
        iosClientId: undefined, // Optional: iOS client ID
        scopes: ['profile', 'email'],
      });
      this.initialized = true;
    } catch (error) {
      console.error('Google Sign-In configuration error:', error);
    }
  }

  /**
   * Check if Google Play Services are available (Android only)
   */
  async hasPlayServices(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      return true;
    } catch (error) {
      console.error('Google Play Services not available:', error);
      return false;
    }
  }

  /**
   * Sign in with Google
   */
  async signIn(): Promise<GoogleUser | null> {
    try {
      const hasPlayServices = await this.hasPlayServices();
      if (!hasPlayServices) {
        throw new Error('Google Play Services not available');
      }

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) {
        throw new Error('No ID token received');
      }

      return {
        idToken: userInfo.data.idToken,
        user: {
          id: userInfo.data.user.id,
          name: userInfo.data.user.name,
          email: userInfo.data.user.email,
          photo: userInfo.data.user.photo,
          givenName: userInfo.data.user.givenName,
          familyName: userInfo.data.user.familyName,
        },
      };
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.error('Google Sign-In error:', error);
      }
      return null;
    }
  }

  /**
   * Sign out from Google
   */
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google Sign-Out error:', error);
    }
  }

  /**
   * Revoke access
   */
  async revokeAccess(): Promise<void> {
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.error('Google revoke access error:', error);
    }
  }

  /**
   * Check if user is signed in
   */
  async isSignedIn(): Promise<boolean> {
    try {
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      console.error('Check signed in error:', error);
      return false;
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<GoogleUser | null> {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      if (!userInfo || !userInfo.data?.idToken) {
        return null;
      }

      return {
        idToken: userInfo.data.idToken,
        user: {
          id: userInfo.data.user.id,
          name: userInfo.data.user.name,
          email: userInfo.data.user.email,
          photo: userInfo.data.user.photo,
          givenName: userInfo.data.user.givenName,
          familyName: userInfo.data.user.familyName,
        },
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get access token
   */
  async getTokens(): Promise<{ idToken: string; accessToken: string } | null> {
    try {
      const tokens = await GoogleSignin.getTokens();
      return {
        idToken: tokens.idToken,
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      console.error('Get tokens error:', error);
      return null;
    }
  }
}

export const googleAuthService = new GoogleAuthService();
