import { Platform } from 'react-native';
import { appleAuth } from '@invertase/react-native-apple-authentication';

export interface AppleUser {
  identityToken: string;
  authorizationCode: string;
  user: string;
  fullName?: {
    givenName: string | null;
    familyName: string | null;
    nickname: string | null;
  };
  email?: string | null;
  realUserStatus: number; // 0 = unsupported, 1 = unknown, 2 = likely real
}

class AppleAuthService {
  /**
   * Check if Apple Sign-In is supported (iOS 13+)
   */
  isSupported(): boolean {
    if (Platform.OS !== 'ios') return false;
    return appleAuth.isSupported;
  }

  /**
   * Sign in with Apple
   */
  async signIn(): Promise<AppleUser | null> {
    if (!this.isSupported()) {
      console.warn('Apple Sign-In is not supported on this device');
      return null;
    }

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Get credential state
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const { identityToken, authorizationCode, user, fullName, email, realUserStatus } =
          appleAuthRequestResponse;

        if (!identityToken) {
          throw new Error('No identity token received');
        }

        return {
          identityToken,
          authorizationCode: authorizationCode || '',
          user,
          fullName: fullName
            ? {
                givenName: fullName.givenName,
                familyName: fullName.familyName,
                nickname: fullName.nickname,
              }
            : undefined,
          email,
          realUserStatus: realUserStatus || 0,
        };
      } else {
        throw new Error(`Invalid credential state: ${credentialState}`);
      }
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('User cancelled Apple Sign-In');
      } else if (error.code === appleAuth.Error.FAILED) {
        console.log('Apple Sign-In failed');
      } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
        console.log('Invalid response from Apple');
      } else if (error.code === appleAuth.Error.NOT_HANDLED) {
        console.log('Apple Sign-In not handled');
      } else if (error.code === appleAuth.Error.UNKNOWN) {
        console.log('Unknown Apple Sign-In error');
      } else {
        console.error('Apple Sign-In error:', error);
      }
      return null;
    }
  }

  /**
   * Get credential state for user
   */
  async getCredentialState(user: string): Promise<number> {
    if (!this.isSupported()) {
      return appleAuth.State.UNKNOWN;
    }

    try {
      return await appleAuth.getCredentialStateForUser(user);
    } catch (error) {
      console.error('Get credential state error:', error);
      return appleAuth.State.UNKNOWN;
    }
  }

  /**
   * Check if user is authorized
   */
  async isAuthorized(user: string): Promise<boolean> {
    const state = await this.getCredentialState(user);
    return state === appleAuth.State.AUTHORIZED;
  }

  /**
   * Add credential state change listener (iOS only)
   */
  onCredentialRevoked(callback: () => void): (() => void) | undefined {
    if (!this.isSupported()) {
      return undefined;
    }

    return appleAuth.onCredentialRevoked(callback);
  }
}

export const appleAuthService = new AppleAuthService();
export { appleAuth }; // Export for state constants
