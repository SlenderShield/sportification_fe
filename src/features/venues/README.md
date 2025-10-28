# Venues Feature

## Purpose
Enable users to discover and book sports venues with location-based search, map integration, and secure payment processing.

## Key Components

### Services
- **VenueService.ts**: Business logic for venue operations
- **MapService.ts**: Location utilities, distance calculations, geocoding, directions

### Screens
- **VenuesScreen.tsx**: Browse venues with map view and filters
- **VenueDetailScreen.tsx**: View venue details, amenities, and availability
- **CreateBookingScreen.tsx**: Book venue with payment processing

### State Management
- **venueApi.ts**: RTK Query API for venue and booking operations
- **venuesSlice.ts**: UI state (filters, map region, selected venue)
- **venuesSelectors.ts**: Derived state selectors

### Repositories
- **VenueRepository.ts**: Data access layer for venue API calls

### Types
- **venue.ts**: Venue, Booking, VenueFilters, Amenity interfaces

## Features Implemented

✅ Venue discovery with map view  
✅ Location-based search and filtering  
✅ Distance calculations from user location  
✅ Venue details with photos and amenities  
✅ Booking system with date/time selection  
✅ Stripe payment processing  
✅ Booking history and management  
✅ Get directions to venue  
✅ Venue availability checking  
✅ Price filtering and sorting

## Dependencies

### External
- `react-native-maps` - Map component and markers
- `@react-native-community/geolocation` - User location services
- `@stripe/stripe-react-native` - Payment processing
- Google Maps API - Geocoding and directions

### Internal
- `src/shared/components/organisms/MapComponent` - Reusable map wrapper
- `src/features/profile/services/paymentService` - Stripe integration
- `src/features/profile/components/PaymentForm` - Payment UI
- `src/shared/utils/formatUtils` - Currency formatting

## Integration Points

### Used By
- Matches feature (match venue location)
- Tournaments feature (tournament venue)

### Uses
- Auth feature for authenticated bookings
- Profile feature for payment processing
- Maps API for location services

## Usage Example

```typescript
// Search venues
import { useGetVenuesQuery } from '../store/venueApi';

const { data: venues } = useGetVenuesQuery({
  location: { lat: 37.78, lng: -122.4 },
  radius: 10, // km
  sport: 'soccer'
});

// Book a venue
import { useCreateBookingMutation } from '../store/venueApi';
import { paymentService } from '../../profile/services/paymentService';

const [createBooking] = useCreateBookingMutation();

// Create payment intent
const { clientSecret } = await paymentService.createPaymentIntent({
  amount: 5000, // $50 in cents
  venueId: venue.id
});

// Process payment and create booking
const booking = await createBooking({
  venueId: venue.id,
  date: selectedDate,
  time: selectedTime,
  paymentIntentId: clientSecret
}).unwrap();

// Calculate distance
import { mapService } from '../services/mapService';

const distance = mapService.calculateDistance(
  userLocation,
  venueLocation
);
console.log(`Venue is ${distance.toFixed(1)} km away`);
```

## Business Rules

- Bookings require payment confirmation
- Venue must be available for selected date/time
- Minimum booking duration varies by venue
- Cancellation policy enforced
- Payment refunds handled per venue policy
- Location permissions required for distance-based search

## Reusability Notes

- **Map Service**: Highly reusable for any location-based feature
- **Payment Integration**: PaymentService and PaymentForm reusable for any transaction
- **Location Utilities**: Distance calculations, geocoding reusable
- **Map Component**: MapComponent in shared/ ready for other features

## Recommended Refactoring

### Move to Shared
Consider moving these to `src/shared/` for wider reuse:
- `mapService.ts` → `src/shared/services/mapService.ts`
- Payment components → Already in profile, could be in shared

### Integration Opportunities
- Match creation could use MapService for location input
- Tournament venues could reuse booking system
- Team practice locations could leverage venue discovery
