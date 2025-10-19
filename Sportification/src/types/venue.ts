export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  sports: string[];
  facilities: string[];
  images?: string[];
  pricing: VenuePricing[];
  availability: VenueAvailability[];
  rating?: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VenuePricing {
  sport?: string;
  pricePerHour: number;
  currency: string;
}

export interface VenueAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: string;
  venueId: string;
  venue?: Venue;
  userId: string;
  startTime: string;
  endTime: string;
  sport: string;
  participants: string[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalPrice: number;
  promoCode?: string;
  checkIn?: string;
  checkOut?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  venueId: string;
  startTime: string;
  endTime: string;
  sport: string;
  participants?: string[];
  promoCode?: string;
}

export interface CheckAvailabilityRequest {
  venueId: string;
  startTime: string;
  endTime: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  conflictingBookings?: Booking[];
}
