# Mobile App Integration - Quick Start

Get the eHub mobile app up and running with new location-based services in 15 minutes.

---

## Pre-requisites

- ✅ Backend deployed (eHubGo at https://ehubgo.onrender.com/api/v1)
- ✅ Node.js 18+
- ✅ Expo CLI installed
- ✅ Android Emulator or iOS Simulator running

---

## Step 1: Setup Environment (2 min)

### 1.1 Create `.env` file in `ehub/` root:

```bash
# Backend API
EXPO_PUBLIC_API_URL=https://ehubgo.onrender.com/api/v1

# OSRM (for ETA calculations)
EXPO_PUBLIC_OSRM_URL=https://router.project-osrm.org/

# Firebase (optional - if using auth)
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
```

### 1.2 Verify dependencies are installed:

```bash
cd ehub
npm install
```

Check that these packages exist in `package.json`:
- `expo-location` - GPS access
- `axios` - HTTP client
- `react-query` - Caching layer
- `expo-router` - Navigation

---

## Step 2: Verify New Files Exist (1 min)

These files were just created. Verify they're in place:

```
ehub/
├── hooks/
│   ├── useLocation.ts          ✅ NEW - Location tracking
│   ├── useDelivery.ts          ✅ NEW - Delivery validation & fees
│   └── useSpatial.ts           ✅ NEW - H3 grid & ETA
├── services/
│   ├── apiClient.ts            ✅ Existing base client
│   └── ecommerceClient.ts      ✅ NEW - API endpoints
├── components/
│   └── DeliveryFlow.tsx        ✅ NEW - Checkout component
├── MOBILE_INTEGRATION_GUIDE.md ✅ NEW - Full documentation
└── MOBILE_SETUP_QUICK_START.md (this file)
```

---

## Step 3: Test Location Services (3 min)

### 3.1 Create a test screen `ehub/app/test-location.tsx`:

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useLocation } from '@/hooks/useLocation';

export default function TestLocation() {
  const { location, loading, error, requestPermission } = useLocation();

  if (loading) return <Text>Getting location...</Text>;
  
  if (error) return (
    <View>
      <Text>Error: {error}</Text>
      <Button title="Request Permission" onPress={requestPermission} />
    </View>
  );

  if (!location) return <Text>No location</Text>;

  return (
    <View>
      <Text>Latitude: {location.latitude}</Text>
      <Text>Longitude: {location.longitude}</Text>
      <Text>Address: {location.addressText}</Text>
      <Text>Accuracy: {location.accuracy}m</Text>
    </View>
  );
}
```

### 3.2 Run the app:

```bash
npx expo start
```

In the Expo CLI, press:
- `i` for iOS simulator
- `a` for Android emulator

### 3.3 Navigate to `test-location` route:

On the home screen, add a link or manually navigate to see if:
- ✅ Location loads (or shows default Nairobi)
- ✅ Address text displays
- ✅ Accuracy shows

---

## Step 4: Test Delivery Validation (3 min)

### 4.1 Create test screen `ehub/app/test-delivery.tsx`:

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import { useDelivery } from '@/hooks/useDelivery';

const SHOP_LOCATION = { latitude: -1.2841, longitude: 36.8172 }; // Nairobi CBD

export default function TestDelivery() {
  const { location: userLoc } = useLocation();
  const { validateDeliveryArea, calculateDeliveryFee, error } = useDelivery();
  const [result, setResult] = useState<any>(null);

  const handleValidate = async () => {
    if (!userLoc) return;
    
    const validation = await validateDeliveryArea(SHOP_LOCATION, userLoc);
    setResult({ step: 'validation', data: validation });
    
    if (validation.valid) {
      const estimate = await calculateDeliveryFee(SHOP_LOCATION, userLoc);
      setResult({ step: 'estimate', data: estimate });
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TouchableOpacity onPress={handleValidate}>
        <Text style={{ color: 'blue', fontSize: 16 }}>Test Delivery</Text>
      </TouchableOpacity>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
    </View>
  );
}
```

### 4.2 Test results you should see:

**If within delivery area:**
```json
{
  "step": "estimate",
  "data": {
    "delivery_fee": 250,
    "estimated_minutes": 25,
    "distance_km": 3.5
  }
}
```

**If outside delivery area:**
```json
{
  "step": "validation",
  "data": {
    "valid": false,
    "message": "Shop cannot deliver to this location"
  }
}
```

---

## Step 5: Integrate into Existing Miniservices (5 min)

### 5.1 Update `ehub/app/miniservices/food.tsx`

Copy the complete implementation from `FOOD_INTEGRATION_EXAMPLE.tsx`:

```bash
# Option 1: Copy the example
cp ehub/app/miniservices/FOOD_INTEGRATION_EXAMPLE.tsx ehub/app/miniservices/food.tsx

# Option 2: Manually update key parts:
# - Import: useLocation, useDelivery, DeliveryFlow
# - Add location permission request
# - Add DeliveryFlow component to checkout
```

### 5.2 Update `ehub/app/miniservices/taxi.tsx`

Add location tracking:

```tsx
import { useLocation } from '@/hooks/useLocation';
import { useSpatial } from '@/hooks/useSpatial';

export default function TaxiScreen() {
  const { location: userLoc, startTracking, stopTracking } = useLocation({ 
    enableTracking: true,
    updateInterval: 5000 
  });
  
  const { calculateETA, isWithinServiceArea } = useSpatial();

  useEffect(() => {
    return () => stopTracking(); // Cleanup on unmount
  }, []);

  // Fetch drivers and filter by H3 distance
  useEffect(() => {
    if (!userLoc) return;
    fetchNearbyDrivers();
  }, [userLoc]);
}
```

### 5.3 Update `ehub/app/miniservices/edelivery.tsx`

Add delivery validation:

```tsx
import { useLocation } from '@/hooks/useLocation';
import { DeliveryFlow } from '@/components/DeliveryFlow';

export default function EdeliveryScreen() {
  const { location } = useLocation();
  const [selectedShop, setSelectedShop] = useState(null);

  return (
    <>
      {selectedShop ? (
        <DeliveryFlow
          shopLocation={selectedShop}
          onSuccess={(estimate) => submitOrder(estimate)}
          onError={(error) => alert(error)}
        />
      ) : (
        <ShopList onSelectShop={setSelectedShop} />
      )}
    </>
  );
}
```

---

## Step 6: Test Complete Flow (1 min)

### 6.1 Launch app and navigate to Food service:

```bash
npx expo start
# Press 'i' or 'a' to open simulator
# Click on Food/Delivery miniservice
```

### 6.2 You should see:

1. ✅ Location permission request
2. ✅ User's current location displayed
3. ✅ Restaurant list with delivery availability
4. ✅ Select restaurant → Delivery flow
5. ✅ Delivery fee calculated
6. ✅ "Confirm Order" button enabled

### 6.3 If something fails:

Check the console:
```bash
# In Expo CLI, press 'j' to open debugger
# Look for errors in console
```

Common issues:
- **"Can't connect to backend"** → Check `EXPO_PUBLIC_API_URL` is correct
- **"Location always shows default"** → Simulator needs location permission configured
- **"Delivery validation fails"** → User might be outside of Nairobi (test area)

---

## Step 7: Basic Caching with React Query (1 min)

### 7.1 Create `ehub/hooks/useProductsQuery.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import * as EcommerceClient from '@/services/ecommerceClient';
import { useLocation } from './useLocation';

export function useFeaturedProductsQuery() {
  const { location } = useLocation();

  return useQuery({
    queryKey: ['featured-products', location?.latitude, location?.longitude],
    queryFn: () => EcommerceClient.getFeaturedProducts({
      limit: 10,
      latitude: location?.latitude,
      longitude: location?.longitude,
      maxGridDistance: 10,
    }),
    enabled: !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 7.2 Use in component:

```tsx
const { data: products, isLoading } = useFeaturedProductsQuery();

return (
  <FlatList 
    data={products} 
    renderItem={({ item }) => <ProductCard product={item} />}
  />
);
```

---

## Troubleshooting

### Issue: "Cannot find module '@/hooks/useLocation'"

**Solution**: Check file paths in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: "Location always returns default"

**Solution**: 
- Clear app cache: `npx expo prebuild --clean`
- Grant location permission in simulator settings
- For emulator, use `Mock Location` app

### Issue: "Delivery validation returns 'service error'"

**Solution**:
- Check backend is running: https://ehubgo.onrender.com/api/v1/health
- Check OSRM is accessible: https://router.project-osrm.org/
- Review backend logs for OSRM errors

### Issue: "DeliveryFlow component not found"

**Solution**:
- Verify file exists: `ehub/components/DeliveryFlow.tsx`
- Check import path: `import { DeliveryFlow } from '@/components/DeliveryFlow'`

---

## Next Steps

1. **Integrate other miniservices**:
   - `taxi.tsx` → Add ETA tracking
   - `edelivery.tsx` → Add delivery validation
   - `ebus.tsx` → Add route planning
   - `ehealth.tsx` → Add clinic location filter
   - etc.

2. **Add error recovery**:
   - Implement exponential backoff for failed requests
   - Add offline support with Async Storage
   - Queue failed requests for retry

3. **Optimize performance**:
   - Use React Query prefetching
   - Implement image caching
   - Add virtual scrolling for large lists

4. **Add analytics**:
   - Track user location updates
   - Monitor delivery validation latency
   - Log ETA calculation times

5. **Write tests**:
   - Unit tests for hooks
   - Integration tests with mock API
   - E2E tests with real backend

---

## Deployment Checklist

Before deploying to production:

- [ ] Environment variables set (API URL, OSRM URL)
- [ ] Location permissions properly requested
- [ ] Error handling covers all failure scenarios
- [ ] Delivery fee calculation validated
- [ ] ETA accuracy acceptable (within 5 min)
- [ ] Tested on real device (not just simulator)
- [ ] Network latency tested on 3G/4G
- [ ] Offline mode tested
- [ ] Analytics tracking enabled
- [ ] A/B testing framework ready

---

## Resources

- **Complete Guide**: [MOBILE_INTEGRATION_GUIDE.md](./MOBILE_INTEGRATION_GUIDE.md)
- **Backend API**: [ECOMMERCE_REFACTORING.md](../eHubGo/ECOMMERCE_REFACTORING.md)
- **Example Code**: [FOOD_INTEGRATION_EXAMPLE.tsx](./app/miniservices/FOOD_INTEGRATION_EXAMPLE.tsx)
- **H3 Grid**: https://h3geo.org/
- **Expo Docs**: https://docs.expo.dev/

---

**Status**: Ready to integrate
**Estimated Time**: 15 minutes for initial setup + 30 minutes per miniservice
**Support**: Check MOBILE_INTEGRATION_GUIDE.md for detailed troubleshooting
