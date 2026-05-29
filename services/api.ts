import { apiClient } from './apiClient';

export const api = {
  // Auth Methods
  login: (data: any) => apiClient.post('/auth/login', data),
  register: (data: any) => apiClient.post('/auth/register', data),

  getHubs: () => apiClient.get('/hubs'),
  createHub: (name: string, description: string) => apiClient.post('/hubs', { id: Math.random().toString(36).substr(2, 9), name, description }),
  getTasks: () => apiClient.get('/tasks'),
  createTask: (title: string, priority: number) => apiClient.post('/tasks', { title, priority }),

  // Driver / Taxi Methods
  createDriver: (id: string, name: string, status: string = 'online') => apiClient.post('/drivers', { id, name, status }),
  updateLocation: (longitude: number, latitude: number) => apiClient.post('/taxi/location', { longitude, latitude }),
  updateStatus: (status: string) => apiClient.post('/taxi/status', { status }),
  getDriverLocation: (id?: string) => apiClient.get(`/taxi/location${id ? `?driver_id=${id}` : ''}`),
  getDriverTasks: () => apiClient.get('/taxi/driver/tasks'),
  getRideRequests: () => apiClient.get('/taxi/requests'),
  getDeliveryRequests: () => apiClient.get('/delivery/requests'),
  acceptRideRequest: (tripId: string) => apiClient.post('/taxi/driver/accept', { trip_id: tripId }),
  declineRideRequest: (tripId: string) => apiClient.post('/taxi/driver/decline', { trip_id: tripId }),
  acceptDeliveryRequest: (orderId: string) => apiClient.post('/delivery/driver/accept', { order_id: orderId }),
  declineDeliveryRequest: (orderId: string) => apiClient.post('/delivery/driver/decline', { order_id: orderId }),
  getNearbyDrivers: (longitude: number, latitude: number, limit: number = 5, radius: number = 5000) => apiClient.get(`/drivers/nearby?longitude=${longitude}&latitude=${latitude}&limit=${limit}&radius=${radius}`),
  getNearbyMotorbikeDrivers: (longitude: number, latitude: number, limit: number = 5, radius: number = 5000) => apiClient.get(`/delivery/drivers/nearby?longitude=${longitude}&latitude=${latitude}&limit=${limit}&radius=${radius}`),
  createTaxiTrip: (tripData: any) => apiClient.post('/taxi/request', tripData),

  // Business / Mall Methods
  getBusinessProfile: (id: string) => apiClient.get(`/businesses/${id}`),
  getBusinessProducts: (businessId: string, limit: number = 10, offset: number = 0) => apiClient.get(`/products?business_id=${businessId}&limit=${limit}&offset=${offset}`),
  getProductDetails: (id: string) => apiClient.get(`/products/${id}`),
  getBusinessServices: (businessId: string) => apiClient.get(`/services?business_id=${businessId}`),
  getServicesByType: (type: string) => apiClient.get(`/services?type=${type}`),
  getBusinessProperties: (businessId: string) => apiClient.get(`/properties?business_id=${businessId}`),

  // Cart Methods
  getCart: () => apiClient.get('/cart'),
  addToCart: (businessId: string, itemId: string, itemType: string, quantity: number = 1) => apiClient.post('/cart', { business_id: businessId, item_id: itemId, item_type: itemType, quantity }),
  removeFromCart: (id: string) => apiClient.delete(`/cart/${id}`),
  updateCartItemQuantity: (id: string, quantity: number) => apiClient.put(`/cart/${id}`, { quantity }),
  getOrdersByUserID: (userId: string) => apiClient.get('/orders'),
  checkout: (shippingAddressId: string) => apiClient.post('/checkout', { shipping_address_id: shippingAddressId }),
  getAddresses: () => apiClient.get('/addresses'),

  // User Methods
  getWalletBalance: () => apiClient.get('/wallet/balance'),
  getMessages: () => apiClient.get('/messages'),
  getNotifications: () => apiClient.get('/notifications'),
  getBills: () => apiClient.get('/bills'),

  // Specialized Service Methods
  getBusRoutes: () => apiClient.get('/bus/routes'),
  getMovies: (nowPlaying: boolean = true) => apiClient.get(`/cinema/movies/${nowPlaying ? 'now-playing' : 'coming-soon'}`),
  getMovieShowtimes: (movieId: string) => apiClient.get(`/cinema/movies/${movieId}/showtimes`),
  getFlights: () => apiClient.get('/flights'),
  getJobs: () => apiClient.get('/jobs'),

  // Specialized Item Methods
  getGroceries: (businessId?: string) => apiClient.get(businessId ? `/groceries?business_id=${businessId}` : '/groceries'),
  getLiquor: (businessId?: string) => apiClient.get(businessId ? `/liquor?business_id=${businessId}` : '/liquor'),
  getPharmacy: (businessId?: string) => apiClient.get(businessId ? `/pharmacy?business_id=${businessId}` : '/pharmacy'),
  getAllFoodItems: () => apiClient.get('/food-items'),
  getFoodDeliveryEstimate: (payload: { latitude: number; longitude: number; radius?: number }) => apiClient.post('/food/delivery/estimate', payload),

  // Single item endpoints
  getFoodItem: (id: string) => apiClient.get(`/food-items/${id}`),

  // Businesses listing (supports optional filters via query string)
  getBusinesses: (params?: { type?: string; city?: string; owner_id?: string; limit?: number; offset?: number }) => {
    let url = '/businesses';
    if (params) {
      const q = new URLSearchParams();
      if (params.type) q.append('type', params.type);
      if (params.city) q.append('city', params.city);
      if (params.owner_id) q.append('owner_id', params.owner_id);
      if (params.limit) q.append('limit', String(params.limit));
      if (params.offset) q.append('offset', String(params.offset));
      url += `?${q.toString()}`;
    }
    return apiClient.get(url);
  },

  getBusinessesByOwnerId: (ownerId: string, limit: number = 20, offset: number = 0) =>
    apiClient.get(`/businesses?owner_id=${ownerId}&limit=${limit}&offset=${offset}`),

  // Mall / Generic Ecommerce
  getFeaturedProducts: (limit: number = 10, offset: number = 0) => apiClient.get(`/featured-products?limit=${limit}&offset=${offset}`),
  filterProducts: (params: Record<string, string>) => {
    const q = new URLSearchParams(params).toString();
    return apiClient.get(`/products/filter?${q}`);
  },
  getFlashSaleProducts: (limit: number = 5, offset: number = 0) => apiClient.get(`/products?is_flash_sale=true&limit=${limit}&offset=${offset}`),
  getCategories: () => apiClient.get('/categories'),
  getAttributes: () => apiClient.get('/attributes'),
  getAttributeValues: (attrID: string) => apiClient.get(`/attributes/${attrID}/values`),
  getProperties: (filters?: { city?: string, max_price?: number, min_rooms?: number }) => {
    let url = '/properties';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.max_price) params.append('max_price', filters.max_price.toString());
      if (filters.min_rooms) params.append('min_rooms', filters.min_rooms.toString());
      url += '?' + params.toString();
    }
    return apiClient.get(url);
  },
  getC2CListings: () => apiClient.get('/c2c/listings'),
  getReviewsByTarget: (targetId: string, targetType: string) => apiClient.get(`/reviews?target_id=${targetId}&target_type=${targetType}`),
  getTours: () => apiClient.get('/tours'),
  getGroceryDeliveryQuote: (data: any) => apiClient.post('/groceries/delivery/estimate', data),
  getGroceryStores: (latitude: number, longitude: number, radius: number = 5000) => apiClient.get(`/grocery/stores?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),
  getProperty: (id: string) => apiClient.get(`/properties/${id}`),
  bookProperty: (data: any) => apiClient.post('/properties/bookings', data),
};
