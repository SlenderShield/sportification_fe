import { logger } from '@core';
import { LoginManager, AccessToken, Profile, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';

export interface FacebookUser {
  accessToken: string;
  userId: string;
  profile?: {
    userID: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    imageURL: string | null;
  };
}

class FacebookAuthService {
  /**
   * Sign in with Facebook
   */
  async signIn(): Promise<FacebookUser | null> {
    try {
      // Request permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        logger.log('User cancelled Facebook login');
        return null;
      }

      // Get access token
      const accessTokenData = await AccessToken.getCurrentAccessToken();

      if (!accessTokenData) {
        throw new Error('Failed to get access token');
      }

      // Get user profile
      const profile = await this.getUserProfile();

      return {
        accessToken: accessTokenData.accessToken,
        userId: accessTokenData.userID,
        profile,
      };
    } catch (error) {
      logger.error('Facebook Sign-In error:', error);
      return null;
    }
  }

  /**
   * Sign out from Facebook
   */
  async signOut(): Promise<void> {
    try {
      await LoginManager.logOut();
    } catch (error) {
      logger.error('Facebook Sign-Out error:', error);
    }
  }

  /**
   * Get current access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const accessTokenData = await AccessToken.getCurrentAccessToken();
      return accessTokenData?.accessToken || null;
    } catch (error) {
      logger.error('Get access token error:', error);
      return null;
    }
  }

  /**
   * Get user profile using Graph API
   */
  async getUserProfile(): Promise<{
    userID: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    imageURL: string | null;
  } | undefined> {
    return new Promise((resolve) => {
      const infoRequest = new GraphRequest(
        '/me',
        {
          parameters: {
            fields: {
              string: 'id,name,first_name,last_name,email,picture.type(large)',
            },
          },
        },
        (error, result) => {
          if (error) {
            logger.error('Error fetching Facebook profile:', error);
            resolve(undefined);
          } else if (result) {
            const data = result as any;
            resolve({
              userID: data.id,
              name: data.name || null,
              firstName: data.first_name || null,
              lastName: data.last_name || null,
              email: data.email || null,
              imageURL: data.picture?.data?.url || null,
            });
          } else {
            resolve(undefined);
          }
        }
      );

      new GraphRequestManager().addRequest(infoRequest).start();
    });
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const accessToken = await AccessToken.getCurrentAccessToken();
      return !!accessToken;
    } catch (error) {
      logger.error('Check logged in error:', error);
      return false;
    }
  }

  /**
   * Get current profile (from SDK cache)
   */
  async getCurrentProfile(): Promise<Profile | null> {
    try {
      return await Profile.getCurrentProfile();
    } catch (error) {
      logger.error('Get current profile error:', error);
      return null;
    }
  }

  /**
   * Refresh current access token
   */
  async refreshAccessToken(): Promise<string | null> {
    try {
      const result = await AccessToken.refreshCurrentAccessTokenAsync();
      if (result) {
        const accessTokenData = await AccessToken.getCurrentAccessToken();
        return accessTokenData?.accessToken || null;
      }
      return null;
    } catch (error) {
      logger.error('Refresh access token error:', error);
      return null;
    }
  }
}

export const facebookAuthService = new FacebookAuthService();
