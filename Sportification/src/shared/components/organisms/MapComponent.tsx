import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { mapService, Coordinates } from '../../services/mapService';

interface MapComponentProps {
  markers?: Array<{
    id: string;
    coordinate: Coordinates;
    title: string;
    description?: string;
  }>;
  initialRegion?: Region;
  showUserLocation?: boolean;
  onMarkerPress?: (markerId: string) => void;
  onRegionChange?: (region: Region) => void;
  height?: number;
  showDirectionsButton?: boolean;
  selectedMarkerId?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  markers = [],
  initialRegion,
  showUserLocation = true,
  onMarkerPress,
  onRegionChange,
  height = 300,
  showDirectionsButton = false,
  selectedMarkerId,
}) => {
  const [region, setRegion] = useState<Region | undefined>(initialRegion);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (markers.length > 0 && !initialRegion) {
      const coordinates = markers.map((m) => m.coordinate);
      const calculatedRegion = mapService.getRegionForCoordinates(coordinates);
      if (calculatedRegion) {
        setRegion(calculatedRegion);
      }
    }
  }, [markers, initialRegion]);

  const initializeMap = async () => {
    setLoading(true);
    const hasPermission = await mapService.requestLocationPermission();
    setLocationPermission(hasPermission);

    if (!initialRegion && markers.length === 0 && hasPermission) {
      const location = await mapService.getCurrentLocation();
      if (location) {
        setRegion(mapService.createRegion(location, 0.05));
      }
    }
    setLoading(false);
  };

  const handleMarkerPress = (markerId: string) => {
    if (onMarkerPress) {
      onMarkerPress(markerId);
    }
  };

  const handleGetDirections = () => {
    if (selectedMarkerId) {
      const marker = markers.find((m) => m.id === selectedMarkerId);
      if (marker) {
        mapService.openDirections(marker.coordinate, marker.title);
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { height }]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  if (!region) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.errorText}>Unable to load map</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={showUserLocation && locationPermission}
        showsMyLocationButton={showUserLocation && locationPermission}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onPress={() => handleMarkerPress(marker.id)}
            pinColor={marker.id === selectedMarkerId ? '#F97316' : '#1E3A8A'}
          />
        ))}
      </MapView>
      
      {showDirectionsButton && selectedMarkerId && (
        <View style={styles.directionsButtonContainer}>
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={handleGetDirections}
          >
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
  },
  directionsButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  directionsButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapComponent;
