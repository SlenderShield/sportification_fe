export interface Venue {
  _id: string;
  name: string;
  description?: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
    coordinates?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  sports: string[];
  facilities: string[];
  amenities: string[];
  images: string[];
  operatingHours?: OperatingHours[];
  rules?: string[];
  cancellationPolicy?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  pricing?: VenuePricing[];
  ratings?: {
    average: number;
    count: number;
  };
  status: 'active' | 'inactive' | 'maintenance';
  isVerified: boolean;
  owner: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
  updatedAt?: string;
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface VenuePricing {
  sport?: string;
  pricePerHour: number;
  currency: string;
  peakHourMultiplier?: number;
}

export interface Booking {
  _id: string;
  venue: {
    _id: string;
    name: string;
    location: {
      address: string;
    };
  };
  user: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  sport: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  participants?: number;
  pricing: {
    baseRate: number;
    totalCost: number;
    currency: string;
    discount?: number;
    tax?: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  venueId: string;
  sport: string;
  date: string;
  startTime: string;
  endTime: string;
  participants?: number;
  notes?: string;
}

export interface CheckAvailabilityRequest {
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  conflictingBookings?: {
    _id: string;
    startTime: string;
    endTime: string;
  }[];
  suggestedSlots?: {
    startTime: string;
    endTime: string;
  }[];
}
