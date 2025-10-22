import { biometricService } from '../../src/services/biometricService';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

jest.mock('react-native-biometrics', () => {
  const mockInstance = {
    isSensorAvailable: jest.fn(),
    simplePrompt: jest.fn(),
    createKeys: jest.fn(),
    deleteKeys: jest.fn(),
    biometricKeysExist: jest.fn(),
    createSignature: jest.fn(),
  };

  return jest.fn(() => mockInstance);
});

describe('BiometricService', () => {
  let mockBiometrics: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockBiometrics = new ReactNativeBiometrics();
  });

  describe('checkAvailability', () => {
    it('should return available with FaceID', async () => {
      mockBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometryTypes.FaceID,
      });

      const result = await biometricService.checkAvailability();

      expect(result.available).toBe(true);
      expect(result.biometryType).toBe(BiometryTypes.FaceID);
    });

    it('should return available with TouchID', async () => {
      mockBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometryTypes.TouchID,
      });

      const result = await biometricService.checkAvailability();

      expect(result.available).toBe(true);
      expect(result.biometryType).toBe(BiometryTypes.TouchID);
    });

    it('should return not available when biometrics not supported', async () => {
      mockBiometrics.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: null,
      });

      const result = await biometricService.checkAvailability();

      expect(result.available).toBe(false);
      expect(result.biometryType).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      mockBiometrics.isSensorAvailable.mockRejectedValue(new Error('Sensor error'));

      const result = await biometricService.checkAvailability();

      expect(result.available).toBe(false);
      expect(result.biometryType).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('should authenticate successfully', async () => {
      mockBiometrics.simplePrompt.mockResolvedValue({ success: true });

      const result = await biometricService.authenticate('Test authentication');

      expect(result).toBe(true);
      expect(mockBiometrics.simplePrompt).toHaveBeenCalledWith({
        promptMessage: 'Test authentication',
        cancelButtonText: 'Cancel',
      });
    });

    it('should use default message when not provided', async () => {
      mockBiometrics.simplePrompt.mockResolvedValue({ success: true });

      await biometricService.authenticate();

      expect(mockBiometrics.simplePrompt).toHaveBeenCalledWith({
        promptMessage: 'Authenticate to continue',
        cancelButtonText: 'Cancel',
      });
    });

    it('should return false on authentication failure', async () => {
      mockBiometrics.simplePrompt.mockResolvedValue({ success: false });

      const result = await biometricService.authenticate();

      expect(result).toBe(false);
    });

    it('should handle authentication errors', async () => {
      mockBiometrics.simplePrompt.mockRejectedValue(new Error('Auth error'));

      const result = await biometricService.authenticate();

      expect(result).toBe(false);
    });
  });

  describe('createKeys', () => {
    it('should create keys successfully', async () => {
      mockBiometrics.createKeys.mockResolvedValue({ publicKey: 'test-public-key' });

      const result = await biometricService.createKeys();

      expect(result).toBe(true);
    });

    it('should return false when no public key returned', async () => {
      mockBiometrics.createKeys.mockResolvedValue({ publicKey: '' });

      const result = await biometricService.createKeys();

      expect(result).toBe(false);
    });

    it('should handle key creation errors', async () => {
      mockBiometrics.createKeys.mockRejectedValue(new Error('Key creation error'));

      const result = await biometricService.createKeys();

      expect(result).toBe(false);
    });
  });

  describe('deleteKeys', () => {
    it('should delete keys successfully', async () => {
      mockBiometrics.deleteKeys.mockResolvedValue({ keysDeleted: true });

      const result = await biometricService.deleteKeys();

      expect(result).toBe(true);
    });

    it('should return false when keys not deleted', async () => {
      mockBiometrics.deleteKeys.mockResolvedValue({ keysDeleted: false });

      const result = await biometricService.deleteKeys();

      expect(result).toBe(false);
    });

    it('should handle deletion errors', async () => {
      mockBiometrics.deleteKeys.mockRejectedValue(new Error('Deletion error'));

      const result = await biometricService.deleteKeys();

      expect(result).toBe(false);
    });
  });

  describe('keysExist', () => {
    it('should return true when keys exist', async () => {
      mockBiometrics.biometricKeysExist.mockResolvedValue({ keysExist: true });

      const result = await biometricService.keysExist();

      expect(result).toBe(true);
    });

    it('should return false when keys do not exist', async () => {
      mockBiometrics.biometricKeysExist.mockResolvedValue({ keysExist: false });

      const result = await biometricService.keysExist();

      expect(result).toBe(false);
    });

    it('should handle errors checking keys', async () => {
      mockBiometrics.biometricKeysExist.mockRejectedValue(new Error('Check error'));

      const result = await biometricService.keysExist();

      expect(result).toBe(false);
    });
  });

  describe('createSignature', () => {
    it('should create signature successfully', async () => {
      mockBiometrics.createSignature.mockResolvedValue({
        success: true,
        signature: 'test-signature',
      });

      const result = await biometricService.createSignature('test-payload');

      expect(result).toBe('test-signature');
      expect(mockBiometrics.createSignature).toHaveBeenCalledWith({
        promptMessage: 'Sign to authenticate',
        payload: 'test-payload',
      });
    });

    it('should return null on signature failure', async () => {
      mockBiometrics.createSignature.mockResolvedValue({
        success: false,
        signature: '',
      });

      const result = await biometricService.createSignature('test-payload');

      expect(result).toBeNull();
    });

    it('should handle signature creation errors', async () => {
      mockBiometrics.createSignature.mockRejectedValue(new Error('Signature error'));

      const result = await biometricService.createSignature('test-payload');

      expect(result).toBeNull();
    });
  });

  describe('getBiometryTypeName', () => {
    it('should return "Face ID" for FaceID type', () => {
      const name = biometricService.getBiometryTypeName(BiometryTypes.FaceID);
      expect(name).toBe('Face ID');
    });

    it('should return "Touch ID" for TouchID type', () => {
      const name = biometricService.getBiometryTypeName(BiometryTypes.TouchID);
      expect(name).toBe('Touch ID');
    });

    it('should return "Biometric Authentication" for Biometrics type', () => {
      const name = biometricService.getBiometryTypeName(BiometryTypes.Biometrics);
      expect(name).toBe('Biometric Authentication');
    });

    it('should return default name for null type', () => {
      const name = biometricService.getBiometryTypeName(null);
      expect(name).toBe('Biometric Authentication');
    });
  });
});
