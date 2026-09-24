# eHub Mobile App Integration Guide

Complete guide for integrating the refactored backend with the mobile app (Expo/React Native), including location services, delivery management, and miniservice optimization.

---

## Overview

The mobile app integrates with 4 key backend services:

1. **Catalog Service** - Location-aware product discovery
2. **Delivery Service** - Dynamic fee calculation, area validation
3. **Spatial Service** - H3 grid, ETA calculations
4. **Promotion Service** - Flash sales, promo codes

All services support location-based filtering and delivery optimization.

---

## Architecture

### Technology Stack

- **Mobile Framework**: Expo/React Native
- **HTTP Client**: Axios with Firebase auth interceptors
- **Location Services**: expo-location + H3 grid
- **State Management**: React Query (TanStack)
- **Styling**: React Native StyleSheet + themed components

### Service Layers

```
┌─────────────────────────────────────────────────┐
│        React Native Screens                      │
│  (taxi.tsx, food.tsx, edelivery.tsx, etc.)      │
├─────────────────────────────────────────────────┤
│        Custom Hooks                              │
│  (useLocation, useDelivery, useSpatial)         │
├─────────────────────────────────────────────────┤
│        API Client                                │
│  (ecommerceClient.ts, apiClient.ts)             │
├─────────────────────────────────────────────────┤
│        Backend API (eHubGo)                      │
│  (/products, /orders, /spatial, /promotions)   │
└─────────────────────────────────────────────────┘
```

---

## 1. Location Services

### useLocation Hook

Provides real-time location tracking with fallback to default location.

**Features**:
- Current position retrieval
- Continuous tracking
- Geofencing support
- Fallback to default (Nairobi)
- Reverse geocoding (optional)

**Setup**:

```bash
# Already installed
expo-location  # v19.0.8
```

**Usage Example**:

```tsx
import { useLocation } from '../hooks/useLocation';

export default function MyService() {
  const {
    location,
    loading,
    error,
    requestPermission,
    getCurrentLocation,
    startTracking,
    stopTracking,
  } = useLocation({ enableTracking: true });

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (!location) return <NoLocationScreen />;

  return (
    <View>
      <Text>
        Current location: {location.latitude}, {location.longitude}
      </Text>
      <Text>Address: {location.addressText}</Text>
      <Text>Accuracy: {location.accuracy}m</Text>
    </View>
  );
}
```

**API**:

```typescript
interface LocationData {
  latitude: number;
  longitude: number;
  h3Cell?: string;
  accuracy?: number;
  addressText?: string;
  timestamp: number;
}

function useLocation(options?: {
  enableTracking?: boolean;   // Auto-start tracking
  updateInterval?: number;     // Default: 5000ms
}) {
  return {
    location: LocationData | null;
    loading: boolean;
    error: string | null;
    hasPermission: boolean | null;
    requestPermission: () => Promise<boolean>;
    getCurrentLocation: () => Promise<LocationData>;
    startTracking: () => Promise<void>;
    stopTracking: () => void;
  };
}
```

---

## 2. Spatial Services (H3 Grid & ETA)

### useSpatial Hook

Provides location-based spatial operations for geofencing and delivery area validation.

**H3 Grid Overview**:
- Resolution 9: ~0.1 km² cell area, ~180m edge
- Perfect for delivery zone boundaries
- Fast distance calculations

**Setup**:

```bash
# Already in backend
# Frontend just uses the API endpoints
# No additional packages needed
```

**Usage Example**:

```tsx
import { useSpatial } from '../hooks/useSpatial';
import { useLocation } from '../hooks/useLocation';

export default function DeliveryCheck() {
  const { location: userLoc } = useLocation();
  const { 
    convertToH3, 
    calculateH3Distance, 
    calculateETA,
    isWithinServiceArea,
    isCalculating 
  } = useSpatial();

  const shopLocation = { latitude: -1.2341, longitude: 36.7892 };

  const checkDeliveryArea = async () => {
    if (!userLoc) return;

    // Check if shop is within 10 H3 cells (1-2 km)
    const isValid = await isWithinServiceArea(
      shopLocation,
      userLoc,
      10 // maxGridDistance
    );

    if (!isValid) {
      alert('Shop cannot deliver to your area');
      return;
    }

    // Get ETA
    const eta = await calculateETA(shopLocation, userLoc);
    alert(`Estimated: ${eta.duration_minutes} minutes`);
  };

  return (
    <TouchableOpacity onPress={checkDeliveryArea} disabled={isCalculating}>
      <Text>{isCalculating ? 'Checking...' : 'Check Delivery'}</Text>
    </TouchableOpacity>
  );
}
```

**API**:

```typescript
function useSpatial() {
  return {
    convertToH3: (lat: number, lng: number) => Promise<H3Cell>;
    calculateH3Distance: (cell1: string, cell2: string) => Promise<number>;
    calculateETA: (start: Location, end: Location) => Promise<ETAResult>;
    getCellCenter: (h3Cell: string) => Promise<LocationCoordinates>;
    isWithinServiceArea: (
      source: Location, 
      target: Location, 
      maxGridDistance: number
    ) => Promise<boolean>;
    isCalculating: boolean;
    error: string | null;
    clearError: () => void;
  };
}
```

---

## 3. Delivery Services

### useDelivery Hook

Manages complete delivery workflow: validation → fee calculation.

**Workflow**:
1. **Validate Area** - Fail-fast check using H3 distance
2. **Calculate Fee** - Dynamic pricing based on Haversine distance

**Pricing Model**:
- Base: 200 KES
- 0-5 km: 10 KES/km
- 5+ km: 15 KES/km

**Usage Example**:

```tsx
import { useDelivery } from '../hooks/useDelivery';
import { useLocation } from '../hooks/useLocation';

export default function CheckoutScreen() {
  const { location: userLoc } = useLocation();
  const { 
    validateDeliveryArea, 
    calculateDeliveryFee,
    validateAndCalculate,
    isLoading,
    error 
  } = useDelivery();

  const shopLoc = { latitude: -1.2341, longitude: 36.7892 };

  const handleCheckout = async () => {
    if (!userLoc) return;

    // Option 1: Two-step process (more control)
    const validation = await validateDeliveryArea(shopLoc, userLoc);
    if (!validation.valid) {
      alert('Cannot deliver to your location');
      return;
    }

    const estimate = await calculateDeliveryFee(shopLoc, userLoc);
    showDeliveryFee(estimate.delivery_fee, estimate.estimated_minutes);

    // Option 2: One-step convenience function
    const result = await validateAndCalculate(shopLoc, userLoc);
    if (result.valid && result.estimate) {
      proceedToPayment(result.estimate);
    }
  };

  return (
    <TouchableOpacity onPress={handleCheckout} disabled={isLoading}>
      <Text>{isLoading ? 'Validating...' : 'Proceed to Checkout'}</Text>
    </TouchableOpacity>
  );
}
```

**API**:

```typescript
function useDelivery() {
  return {
    validateDeliveryArea: (
      shop: Location, 
      user: Location, 
      maxDistance?: number
    ) => Promise<DeliveryAreaValidation>;
    
    calculateDeliveryFee: (
      shop: Location, 
      user: Location
    ) => Promise<DeliveryEstimate | null>;
    
    validateAndCalculate: (
      shop: Location, 
      user: Location, 
      maxDistance?: number
    ) => Promise<{
      valid: boolean;
      estimate?: DeliveryEstimate;
      error?: string;
    }>;
    
    isValidating: boolean;
    isCalculating: boolean;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
  };
}
```

### DeliveryFlow Component

Pre-built component for complete delivery checkout UI.

**Features**:
- Automatic location detection
- Visual feedback (loading, error, success)
- Delivery fee display
- One-click confirmation

**Usage Example**:

```tsx
import { DeliveryFlow } from '../components/DeliveryFlow';

export default function OrderSummary() {
  const shopLocation = { latitude: -1.2341, longitude: 36.7892 };

  return (
    <DeliveryFlow
      shopLocation={shopLocation}
      maxDeliveryDistance={10}
      showEstimate={true}
      onSuccess={(estimate) => {
        // Proceed with order
        submitOrder({
          delivery_fee: estimate.delivery_fee,
          estimated_time: estimate.estimated_minutes,
        });
      }}
      onError={(error) => {
        Alert.alert('Delivery Error', error);
      }}
      onCancel={() => {
        navigateBack();
      }}
    />
  );
}
```

---

## 4. Product/Catalog Services

### Location-Aware Product Discovery

Featured products can be filtered by user location.

**Usage Example**:

```tsx
import * as EcommerceClient from '../services/ecommerceClient';
import { useLocation } from '../hooks/useLocation';

export default function FeaturedProducts() {
  const { location } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    fetchProducts();
  }, [location]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Option 1: Without location (all products)
      const allProducts = await EcommerceClient.getFeaturedProducts({
        limit: 10,
        offset: 0,
      });

      // Option 2: With location (only deliverable products)
      const nearbyProducts = await EcommerceClient.getFeaturedProducts({
        limit: 10,
        offset: 0,
        latitude: location.latitude,
        longitude: location.longitude,
        maxGridDistance: 10, // Within 1-2 km
      });

      setProducts(nearbyProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

## 5. Miniservice Integration Examples

### Taxi/Hailing Service (taxi.tsx)

Enhanced with spatial services for better ETA and geofencing.

**Integration Points**:

```tsx
import { useLocation } from '../hooks/useLocation';
import { useSpatial } from '../hooks/useSpatial';
import * as EcommerceClient from '../services/ecommerceClient';

export default function TaxiScreen() {
  const { location: userLoc, startTracking } = useLocation({ enableTracking: true });
  const { calculateETA, isWithinServiceArea } = useSpatial();

  useEffect(() => {
    // Get user's H3 cell for geofencing
    fetchNearbyDrivers();
  }, [userLoc]);

  const fetchNearbyDrivers = async () => {
    if (!userLoc) return;

    // Get drivers within service area
    const drivers = await api.getNearbyDrivers(
      userLoc.longitude,
      userLoc.latitude,
      5000 // 5km radius
    );

    // Filter drivers within H3 distance
    const validDrivers = [];
    for (const driver of drivers) {
      const isNearby = await isWithinServiceArea(
        userLoc,
        { latitude: driver.latitude, longitude: driver.longitude },
        20 // ~3-4 km max
      );
      if (isNearby) {
        validDrivers.push(driver);
      }
    }

    setNearbyDrivers(validDrivers);
  };

  const selectDriver = async (driver: Driver) => {
    // Calculate real ETA
    const eta = await calculateETA(userLoc, {
      latitude: driver.latitude,
      longitude: driver.longitude,
    });

    showDriverInfo({
      ...driver,
      eta_minutes: eta.duration_minutes,
    });
  };
}
```

**Key Features**:
- Real-time driver tracking with H3 geofencing
- Dynamic ETA calculation
- Continuous location updates
- Polyline rendering with driver path

### Food/Delivery Service (food.tsx & edelivery.tsx)

Enhanced with delivery validation and dynamic pricing.

**Integration Points**:

```tsx
import { useLocation } from '../hooks/useLocation';
import { useDelivery } from '../hooks/useDelivery';
import { DeliveryFlow } from '../components/DeliveryFlow';

export default function FoodScreen() {
  const { location: userLoc } = useLocation();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const selectRestaurant = async (restaurant) => {
    // Show delivery checkout flow
    setSelectedRestaurant(restaurant);
  };

  if (selectedRestaurant) {
    return (
      <DeliveryFlow
        shopLocation={{
          latitude: selectedRestaurant.latitude,
          longitude: selectedRestaurant.longitude,
        }}
        onSuccess={(estimate) => {
          // Create order with delivery info
          submitOrder({
            restaurant_id: selectedRestaurant.id,
            delivery_fee: estimate.delivery_fee,
            estimated_minutes: estimate.estimated_minutes,
          });
        }}
        onError={(error) => {
          Alert.alert('Delivery Not Available', error);
          setSelectedRestaurant(null);
        }}
      />
    );
  }

  return <FoodCatalog onSelectRestaurant={selectRestaurant} />;
}
```

**Key Features**:
- Pre-checkout delivery validation
- Dynamic fee display
- Restaurant filtering by delivery area
- Rating/reviews with delivery time

---

## 6. API Client Integration

### Enhanced API Client

All new endpoints are exposed via `ecommerceClient.ts`.

**Imports**:

```typescript
import * as EcommerceClient from '../services/ecommerceClient';
```

**Available Methods**:

```typescript
// Catalog
getFeaturedProducts(options: { limit, offset, latitude, longitude, maxGridDistance })
getFlashSaleProducts(options: { limit, offset })

// Delivery
validateDeliveryArea(request: DeliveryValidationRequest)
calculateDeliveryFee(request: DeliveryFeeRequest)
getOrder(orderId: string)
getUserOrders(userId: string, options: { limit, offset, status })

// Promotions
getFlashSales(options: { limit, offset })
applyPromoCode(code: string, cartTotal: number)
applyBulkDiscount(request: BulkDiscountRequest)

// Spatial
convertToH3(latitude: number, longitude: number)
getH3Distance(cell1: string, cell2: string)
getCellCenter(h3Cell: string)
calculateETA(request: ETARequest)

// Utilities
validateAndCalculateDelivery(shop: Location, user: Location, maxDistance?)
parseErrorResponse(error: any) // Structured error parsing
```

### Error Handling

All errors follow a consistent format:

```typescript
const error = EcommerceClient.parseErrorResponse(err);
// Returns:
{
  type: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'CONFLICT' | 'SERVICE_ERROR' | 'SYSTEM_ERROR',
  message: string,
  code: string,
  details: any,
  httpStatus: number
}

// Usage:
try {
  await validateDeliveryArea(shop, user);
} catch (err) {
  const error = EcommerceClient.parseErrorResponse(err);
  if (error.type === 'CONFLICT') {
    // Out of delivery area
    Alert.alert('Cannot Deliver', error.message);
  } else if (error.type === 'SERVICE_ERROR') {
    // OSRM down, retry later
    Alert.alert('Service Unavailable', 'Try again in a moment');
  }
}
```

---

## 7. React Query Integration

### Using React Query with New Services

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import * as EcommerceClient from '../services/ecommerceClient';
import { useLocation } from '../hooks/useLocation';

export function useFeaturedProductsQuery(options: any = {}) {
  const { location } = useLocation();

  return useQuery({
    queryKey: ['featured-products', location?.latitude, location?.longitude],
    queryFn: async () => {
      return EcommerceClient.getFeaturedProducts({
        limit: 10,
        offset: 0,
        latitude: location?.latitude,
        longitude: location?.longitude,
        maxGridDistance: 10,
      });
    },
    enabled: !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useValidateDeliveryMutation() {
  return useMutation({
    mutationFn: (vars: { shop: Location; user: Location }) => {
      return EcommerceClient.validateDeliveryArea({
        shop_latitude: vars.shop.latitude,
        shop_longitude: vars.shop.longitude,
        user_latitude: vars.user.latitude,
        user_longitude: vars.user.longitude,
      });
    },
  });
}

// Usage in component
export default function ProductList() {
  const { data: products, isLoading } = useFeaturedProductsQuery();

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
```

---

## 8. Performance Optimization

### Caching Strategies

```typescript
// Featured products cache
- TTL: 15 minutes
- Invalidate on: user swipes refresh, location changes
- Strategy: Cache-aside

// Flash sales cache
- TTL: 5 minutes
- Invalidate on: store updates, time-based
- Strategy: Cache-aside

// Orders cache
- TTL: 1 hour
- Invalidate on: order status change
- Strategy: Cache-aside
```

### Location Update Frequency

```typescript
// Optimize based on service type

// Taxi (continuous tracking)
const { location, startTracking } = useLocation({ 
  enableTracking: true, 
  updateInterval: 5000  // Update every 5s
});

// Food (one-time location)
const { location, getCurrentLocation } = useLocation();
await getCurrentLocation(); // Single fetch

// Delivery (area validation)
const { location } = useLocation(); // Use once at checkout
```

---

## 9. Testing Checklist

### Unit Tests
- [ ] `useLocation` hook with mock permissions
- [ ] `useDelivery` hook with mock API responses
- [ ] `useSpatial` hook with H3 calculations
- [ ] Error parsing for all error types
- [ ] Location fallback to default

### Integration Tests
- [ ] Complete delivery flow (validation → fee)
- [ ] Location permission denial handling
- [ ] Network error resilience
- [ ] Cache hit/miss behavior
- [ ] Multi-location switching

### End-to-End Tests
- [ ] Taxi: Request → Find drivers → Select driver → Track
- [ ] Food: Browse → Select restaurant → Validate delivery → Order
- [ ] Delivery: Get package info → Validate area → Confirm

---

## 10. Migration Checklist

### Phase 1: Setup (Non-breaking)
- [ ] Add new hooks to `hooks/` folder
- [ ] Add `ecommerceClient.ts` to services
- [ ] Add `DeliveryFlow` component
- [ ] Test with mock API responses

### Phase 2: Integration
- [ ] Update taxi.tsx with location tracking
- [ ] Update food.tsx with DeliveryFlow
- [ ] Update edelivery.tsx with delivery validation
- [ ] Add location permissions request

### Phase 3: Optimization
- [ ] Add React Query hooks for caching
- [ ] Optimize location update frequency
- [ ] Implement error recovery
- [ ] Add analytics tracking

### Phase 4: Polish
- [ ] User feedback animations
- [ ] Error message clarity
- [ ] Loading state UI
- [ ] Accessibility improvements

---

## Common Issues & Solutions

### Issue: "Cannot get user location"
**Solution**: Check location permissions
```tsx
const { location, requestPermission, error } = useLocation();
if (error) {
  await requestPermission();
}
```

### Issue: "Delivery fee calculation is slow"
**Solution**: Validate area first (fast H3 check)
```tsx
const validation = await validateDeliveryArea(shop, user);
if (!validation.valid) return; // Fail-fast
const estimate = await calculateDeliveryFee(shop, user);
```

### Issue: "ETA service unavailable"
**Solution**: Implement retry logic with exponential backoff
```tsx
async function calculateETAWithRetry(start, end, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await calculateETA(start, end);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await sleep(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

---

## Resources

- **Backend Guide**: See [ECOMMERCE_REFACTORING.md](../eHubGo/ECOMMERCE_REFACTORING.md)
- **API Setup**: See [SETUP_EXAMPLE.go](../eHubGo/handlers/ecommerce/SETUP_EXAMPLE.go)
- **H3 Grid**: https://h3geo.org
- **Expo Location**: https://docs.expo.dev/versions/latest/sdk/location/
- **React Query**: https://tanstack.com/query/latest

---

**Status**: Ready for Integration
**Estimated Implementation Time**: 2-3 days per miniservice
**Difficulty**: Medium (mostly UI integration)
