import { apiClient } from './apiClient';
import { LocationCoordinates } from '../hooks/useLocation';

/**
 * eCommerce API Client
 * 
 * Provides methods for:
 * - Location-aware product discovery
 * - Delivery validation and fee calculation
 * - Order management
 * - Promotion handling
 * 
 * All endpoints integrate with the spatial/location services
 */

// ===== Product/Catalog Endpoints =====

/**
 * Get featured products with optional location-based filtering
 */
export async function getFeaturedProducts(options: {
  limit?: number;
  offset?: number;
  latitude?: number;
  longitude?: number;
  maxGridDistance?: number;
} = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', String(options.limit));
  if (options.offset) params.append('offset', String(options.offset));
  if (options.latitude && options.longitude) {
    params.append('latitude', String(options.latitude));
    params.append('longitude', String(options.longitude));
    if (options.maxGridDistance) {
      params.append('max_grid_distance', String(options.maxGridDistance));
    }
  }

  return apiClient.get(`/products/featured?${params.toString()}`);
}

/**
 * Get flash sale products
 */
export async function getFlashSaleProducts(options: {
  limit?: number;
  offset?: number;
} = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', String(options.limit));
  if (options.offset) params.append('offset', String(options.offset));

  return apiClient.get(`/products/flash-sales?${params.toString()}`);
}

// ===== Delivery/Order Endpoints =====

export interface DeliveryValidationRequest {
  shop_latitude: number;
  shop_longitude: number;
  user_latitude: number;
  user_longitude: number;
  max_distance?: number;
}

export interface DeliveryValidationResponse {
  valid: boolean;
  shop_h3_cell?: string;
  user_h3_cell?: string;
  message?: string;
}

/**
 * Validate if a shop can deliver to user's location
 * Fast operation using H3 grid distance (fail-fast validation)
 */
export async function validateDeliveryArea(
  request: DeliveryValidationRequest
): Promise<DeliveryValidationResponse> {
  return apiClient.post('/orders/validate-delivery', request);
}

export interface DeliveryFeeRequest {
  shop_latitude: number;
  shop_longitude: number;
  user_latitude: number;
  user_longitude: number;
}

export interface DeliveryEstimate {
  delivery_fee: number;
  estimated_minutes: number;
  distance_km: number;
}

/**
 * Calculate dynamic delivery fee based on actual distance
 * Uses Haversine distance + tiered pricing
 */
export async function calculateDeliveryFee(request: DeliveryFeeRequest): Promise<DeliveryEstimate> {
  return apiClient.post('/orders/calculate-fee', request);
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string) {
  return apiClient.get(`/orders/${orderId}`);
}

/**
 * Get user's orders with pagination
 */
export async function getUserOrders(userId: string, options: {
  limit?: number;
  offset?: number;
  status?: string;
} = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', String(options.limit));
  if (options.offset) params.append('offset', String(options.offset));
  if (options.status) params.append('status', options.status);

  return apiClient.get(`/orders/user/${userId}?${params.toString()}`);
}

// ===== Promotion Endpoints =====

/**
 * Get active flash sales
 */
export async function getFlashSales(options: {
  limit?: number;
  offset?: number;
} = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', String(options.limit));
  if (options.offset) params.append('offset', String(options.offset));

  return apiClient.get(`/promotions/flash-sales?${params.toString()}`);
}

export interface PromoCodeValidation {
  valid: boolean;
  promo_code: string;
  discount: number;
  final_total: number;
  message?: string;
}

/**
 * Apply promo code to cart
 */
export async function applyPromoCode(promoCode: string, cartTotal: number): Promise<PromoCodeValidation> {
  return apiClient.post('/promotions/apply-code', {
    promo_code: promoCode,
    cart_total: cartTotal,
  });
}

export interface BulkDiscountRequest {
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface BulkDiscountResponse {
  items_count: number;
  total_discount: number;
}

/**
 * Apply bulk discount for volume purchases
 */
export async function applyBulkDiscount(request: BulkDiscountRequest): Promise<BulkDiscountResponse> {
  return apiClient.post('/promotions/bulk-discount', request);
}

// ===== Spatial/Location Endpoints =====

export interface H3ConversionResult {
  latitude: number;
  longitude: number;
  h3_cell: string;
}

/**
 * Convert coordinates to H3 cell
 */
export async function convertToH3(latitude: number, longitude: number): Promise<H3ConversionResult> {
  return apiClient.get('/spatial/convert-to-h3', {
    params: { latitude, longitude },
  });
}

export interface H3DistanceResult {
  cell1: string;
  cell2: string;
  distance: number;
}

/**
 * Calculate grid distance between two H3 cells
 */
export async function getH3Distance(cell1: string, cell2: string): Promise<H3DistanceResult> {
  return apiClient.get('/spatial/h3-distance', {
    params: { cell1, cell2 },
  });
}

export interface CellCenterResult {
  h3_cell: string;
  latitude: number;
  longitude: number;
}

/**
 * Get center coordinates of an H3 cell
 */
export async function getCellCenter(cell: string): Promise<CellCenterResult> {
  return apiClient.get('/spatial/cell-center', {
    params: { cell },
  });
}

export interface ETARequest {
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
}

export interface ETAResult {
  duration_seconds: number;
  duration_minutes: number;
  start_h3_cell: string;
  end_h3_cell: string;
}

/**
 * Calculate ETA between two locations
 */
export async function calculateETA(request: ETARequest): Promise<ETAResult> {
  return apiClient.post('/spatial/calculate-eta', request);
}

// ===== Convenience Functions =====

/**
 * Complete delivery checkout workflow:
 * 1. Validate area (fail-fast)
 * 2. Calculate fee
 * 3. Return result
 */
export async function validateAndCalculateDelivery(
  shopLocation: LocationCoordinates,
  userLocation: LocationCoordinates,
  maxDistance: number = 10
): Promise<{
  valid: boolean;
  estimate?: DeliveryEstimate;
  error?: string;
}> {
  try {
    // Step 1: Validate area
    const validation = await validateDeliveryArea({
      shop_latitude: shopLocation.latitude,
      shop_longitude: shopLocation.longitude,
      user_latitude: userLocation.latitude,
      user_longitude: userLocation.longitude,
      max_distance: maxDistance,
    });

    if (!validation.valid) {
      return {
        valid: false,
        error: validation.message || 'Shop cannot deliver to this location',
      };
    }

    // Step 2: Calculate fee
    const estimate = await calculateDeliveryFee({
      shop_latitude: shopLocation.latitude,
      shop_longitude: shopLocation.longitude,
      user_latitude: userLocation.latitude,
      user_longitude: userLocation.longitude,
    });

    return {
      valid: true,
      estimate,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to validate and calculate delivery';
    return {
      valid: false,
      error: message,
    };
  }
}

// ===== Error Handling =====

/**
 * Parse error response from backend
 * Returns structured error information
 */
export function parseErrorResponse(error: any) {
  if (error?.response?.data?.error) {
    const errorData = error.response.data.error;
    return {
      type: errorData.type,
      message: errorData.message,
      code: errorData.code,
      details: errorData.details,
      httpStatus: error.response.status,
    };
  }

  return {
    type: 'UNKNOWN_ERROR',
    message: error?.message || 'An error occurred',
    code: 'UNKNOWN',
    httpStatus: error?.response?.status || 500,
  };
}
