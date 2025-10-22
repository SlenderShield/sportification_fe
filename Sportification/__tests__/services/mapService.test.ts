import { mapService, Coordinates } from '../../src/services/mapService';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
  },
  Linking: {
    openURL: jest.fn(),
  },
}));

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}));

describe('MapService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates correctly', () => {
      const coord1: Coordinates = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco
      const coord2: Coordinates = { latitude: 34.0522, longitude: -118.2437 }; // Los Angeles
      
      const distance = mapService.calculateDistance(coord1, coord2);
      
      // Distance should be approximately 559 km
      expect(distance).toBeGreaterThan(550);
      expect(distance).toBeLessThan(570);
    });

    it('should return 0 for same coordinates', () => {
      const coord: Coordinates = { latitude: 37.7749, longitude: -122.4194 };
      
      const distance = mapService.calculateDistance(coord, coord);
      
      expect(distance).toBe(0);
    });

    it('should handle coordinates across the equator', () => {
      const coord1: Coordinates = { latitude: 10, longitude: 0 };
      const coord2: Coordinates = { latitude: -10, longitude: 0 };
      
      const distance = mapService.calculateDistance(coord1, coord2);
      
      // Distance should be approximately 2222 km (20 degrees of latitude)
      expect(distance).toBeGreaterThan(2200);
      expect(distance).toBeLessThan(2250);
    });
  });

  describe('createRegion', () => {
    it('should create a region with default delta', () => {
      const coordinates: Coordinates = { latitude: 37.7749, longitude: -122.4194 };
      
      const region = mapService.createRegion(coordinates);
      
      expect(region.latitude).toBe(37.7749);
      expect(region.longitude).toBe(-122.4194);
      expect(region.latitudeDelta).toBe(0.01);
      expect(region.longitudeDelta).toBe(0.01);
    });

    it('should create a region with custom delta', () => {
      const coordinates: Coordinates = { latitude: 37.7749, longitude: -122.4194 };
      
      const region = mapService.createRegion(coordinates, 0.05);
      
      expect(region.latitude).toBe(37.7749);
      expect(region.longitude).toBe(-122.4194);
      expect(region.latitudeDelta).toBe(0.05);
      expect(region.longitudeDelta).toBe(0.05);
    });
  });

  describe('getRegionForCoordinates', () => {
    it('should return null for empty array', () => {
      const region = mapService.getRegionForCoordinates([]);
      
      expect(region).toBeNull();
    });

    it('should create region for single coordinate', () => {
      const coordinates: Coordinates[] = [{ latitude: 37.7749, longitude: -122.4194 }];
      
      const region = mapService.getRegionForCoordinates(coordinates);
      
      expect(region).not.toBeNull();
      expect(region?.latitude).toBe(37.7749);
      expect(region?.longitude).toBe(-122.4194);
    });

    it('should create region fitting all coordinates', () => {
      const coordinates: Coordinates[] = [
        { latitude: 37.7749, longitude: -122.4194 },
        { latitude: 37.8044, longitude: -122.2712 },
        { latitude: 37.6879, longitude: -122.4702 },
      ];
      
      const region = mapService.getRegionForCoordinates(coordinates);
      
      expect(region).not.toBeNull();
      expect(region?.latitude).toBeGreaterThan(37.68);
      expect(region?.latitude).toBeLessThan(37.81);
      expect(region?.longitude).toBeGreaterThan(-122.48);
      expect(region?.longitude).toBeLessThan(-122.26);
    });

    it('should add padding to region', () => {
      const coordinates: Coordinates[] = [
        { latitude: 37.0, longitude: -122.0 },
        { latitude: 38.0, longitude: -121.0 },
      ];
      
      const region = mapService.getRegionForCoordinates(coordinates);
      
      // Delta should be 1.2 (1.0 * 1.2 for padding)
      expect(region?.latitudeDelta).toBeGreaterThan(1.1);
      expect(region?.latitudeDelta).toBeLessThan(1.3);
    });
  });

  describe('requestLocationPermission (Android)', () => {
    beforeEach(() => {
      Platform.OS = 'android' as any;
    });

    it('should request permission on Android', async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.GRANTED
      );

      const result = await mapService.requestLocationPermission();

      expect(result).toBe(true);
      expect(PermissionsAndroid.request).toHaveBeenCalledWith(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        expect.any(Object)
      );
    });

    it('should return false when permission denied', async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.DENIED
      );

      const result = await mapService.requestLocationPermission();

      expect(result).toBe(false);
    });

    it('should handle permission error', async () => {
      (PermissionsAndroid.request as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );

      const result = await mapService.requestLocationPermission();

      expect(result).toBe(false);
    });
  });

  describe('requestLocationPermission (iOS)', () => {
    beforeEach(() => {
      Platform.OS = 'ios' as any;
    });

    it('should return true on iOS without requesting', async () => {
      const result = await mapService.requestLocationPermission();

      expect(result).toBe(true);
      expect(PermissionsAndroid.request).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentLocation', () => {
    it('should get current location successfully', async () => {
      const mockPosition = {
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };

      (Geolocation.getCurrentPosition as jest.Mock).mockImplementation((success) => {
        success(mockPosition);
      });

      Platform.OS = 'ios' as any;
      const location = await mapService.getCurrentLocation();

      expect(location).not.toBeNull();
      expect(location?.latitude).toBe(37.7749);
      expect(location?.longitude).toBe(-122.4194);
    });

    it('should return null on location error', async () => {
      (Geolocation.getCurrentPosition as jest.Mock).mockImplementation((success, error) => {
        error({ code: 1, message: 'Permission denied' });
      });

      Platform.OS = 'ios' as any;
      const location = await mapService.getCurrentLocation();

      expect(location).toBeNull();
    });

    it('should return null when permission not granted', async () => {
      Platform.OS = 'android' as any;
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.DENIED
      );

      const location = await mapService.getCurrentLocation();

      expect(location).toBeNull();
    });
  });
});
