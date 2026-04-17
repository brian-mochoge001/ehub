import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Circle } from 'react-native-maps';
import { api } from '@/services/api';
import { Car } from 'lucide-react-native';

interface DriverLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  updated_at: string;
  distance_meters?: number;
}

interface TaxiMapProps {
  driverId?: string;
  userLocation?: { latitude: number; longitude: number };
  showNearby?: boolean;
}

export default function TaxiMap({ driverId, userLocation, showNearby = true }: TaxiMapProps) {
  const [driver, setDriver] = useState<DriverLocation | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<DriverLocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  // Default User Location (Nairobi)
  const userPos = userLocation || { latitude: -1.286389, longitude: 36.817223 };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const poll = () => {
      if (driverId) fetchTrackedDriver();
      if (showNearby) fetchNearbyDrivers();
    };

    poll();
    interval = setInterval(poll, 2000);

    return () => clearInterval(interval);
  }, [driverId, showNearby, fetchTrackedDriver, fetchNearbyDrivers]);

  const fetchTrackedDriver = React.useCallback(async () => {
    if (!driverId) return;
    try {
      const data = await api.getDriverLocation(driverId);
      setDriver(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching driver location:', err);
      setError('Connection lost');
    }
  }, [driverId]);

  const fetchNearbyDrivers = React.useCallback(async () => {
    try {
      const data = await api.getNearbyDrivers(userPos.longitude, userPos.latitude);
      setNearbyDrivers(data);
    } catch (err) {
      console.error('Error fetching nearby drivers:', err);
    }
  }, [userPos.longitude, userPos.latitude]);

  const initialRegion = {
    ...userPos,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {/* User Marker */}
        <Marker
          coordinate={userPos}
          title="You"
          pinColor="blue"
        />

        {/* Tracking Radius (Visualizing PostGIS Search Area) */}
        {showNearby && (
          <Circle
            center={userPos}
            radius={2000} // 2km
            strokeColor="rgba(0, 150, 255, 0.3)"
            fillColor="rgba(0, 150, 255, 0.1)"
          />
        )}

        {/* Tracked Driver */}
        {driver && (
          <Marker
            coordinate={{
              latitude: driver.latitude,
              longitude: driver.longitude,
            }}
            title={driver.name}
            description="Your active driver"
          >
            <View style={styles.driverMarker}>
              <Car size={24} color="#000" />
            </View>
          </Marker>
        )}

        {/* Nearby Drivers (Simulated) */}
        {nearbyDrivers
          .filter(d => d.id !== driverId)
          .map(d => (
            <Marker
              key={d.id}
              coordinate={{
                latitude: d.latitude,
                longitude: d.longitude,
              }}
              title={d.name}
              description={`${Math.round(d.distance_meters || 0)}m away`}
              opacity={0.6}
            >
              <View style={[styles.driverMarker, { backgroundColor: '#FFD700' }]}>
                <Car size={20} color="#000" />
              </View>
            </Marker>
          ))}
      </MapView>
      
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>PostGIS Taxi Simulator</Text>
        {showNearby && (
          <Text style={styles.infoText}>
            Showing {nearbyDrivers.length} nearby drivers (PostGIS ST_Distance)
          </Text>
        )}
        {driver ? (
          <Text style={styles.infoText}>Tracking: {driver.name}</Text>
        ) : (
          <Text style={styles.infoText}>Waiting for ride request...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
    zIndex: 100,
  },
  errorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoBox: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
    color: '#0a7ea4',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  driverMarker: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
});
