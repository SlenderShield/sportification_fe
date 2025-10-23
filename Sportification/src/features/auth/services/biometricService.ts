import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

export interface BiometricCapabilities {
  available: boolean;
  biometryType: BiometryTypes | null;
}

class BiometricService {
  private rnBiometrics: ReactNativeBiometrics;

  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
  }

  /**
   * Check if biometric authentication is available
   */
  async checkAvailability(): Promise<BiometricCapabilities> {
    try {
      const { available, biometryType } = await this.rnBiometrics.isSensorAvailable();
      return {
        available,
        biometryType: biometryType || null,
      };
    } catch (error) {
      console.error('Biometric availability check error:', error);
      return {
        available: false,
        biometryType: null,
      };
    }
  }

  /**
   * Authenticate user with biometrics
   */
  async authenticate(promptMessage?: string): Promise<boolean> {
    try {
      const { success } = await this.rnBiometrics.simplePrompt({
        promptMessage: promptMessage || 'Authenticate to continue',
        cancelButtonText: 'Cancel',
      });
      return success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  /**
   * Create biometric keys for secure storage
   */
  async createKeys(): Promise<boolean> {
    try {
      const { publicKey } = await this.rnBiometrics.createKeys();
      return !!publicKey;
    } catch (error) {
      console.error('Create biometric keys error:', error);
      return false;
    }
  }

  /**
   * Delete biometric keys
   */
  async deleteKeys(): Promise<boolean> {
    try {
      const { keysDeleted } = await this.rnBiometrics.deleteKeys();
      return keysDeleted;
    } catch (error) {
      console.error('Delete biometric keys error:', error);
      return false;
    }
  }

  /**
   * Check if biometric keys exist
   */
  async keysExist(): Promise<boolean> {
    try {
      const { keysExist } = await this.rnBiometrics.biometricKeysExist();
      return keysExist;
    } catch (error) {
      console.error('Check biometric keys error:', error);
      return false;
    }
  }

  /**
   * Create a signature using biometric authentication
   */
  async createSignature(payload: string): Promise<string | null> {
    try {
      const { success, signature } = await this.rnBiometrics.createSignature({
        promptMessage: 'Sign to authenticate',
        payload,
      });
      return success ? signature : null;
    } catch (error) {
      console.error('Create signature error:', error);
      return null;
    }
  }

  /**
   * Get human-readable biometry type name
   */
  getBiometryTypeName(biometryType: BiometryTypes | null): string {
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.Biometrics:
        return 'Biometric Authentication';
      default:
        return 'Biometric Authentication';
    }
  }
}

export const biometricService = new BiometricService();
