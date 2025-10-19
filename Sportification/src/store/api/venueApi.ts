import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { 
  Venue, 
  Booking, 
  CreateBookingRequest, 
  CheckAvailabilityRequest, 
  CheckAvailabilityResponse 
} from '../../types/venue';
import { ApiResponse } from '../../types/api';
import { apiService } from '../../services/api';

export const venueApi = createApi({
  reducerPath: 'venueApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`,
    prepareHeaders: async (headers) => {
      const token = await apiService.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Venue', 'Venues', 'Booking', 'Bookings', 'MyBookings'],
  endpoints: (builder) => ({
    getVenues: builder.query<ApiResponse<Venue[]>, { page?: number; limit?: number; sport?: string; city?: string; search?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.sport) queryParams.append('sport', params.sport);
        if (params.city) queryParams.append('city', params.city);
        if (params.search) queryParams.append('search', params.search);
        return `/venues?${queryParams.toString()}`;
      },
      providesTags: ['Venues'],
    }),
    getVenue: builder.query<ApiResponse<{ venue: Venue }>, string>({
      query: (id) => `/venues/${id}`,
      providesTags: (result, error, id) => [{ type: 'Venue', id }],
    }),
    checkAvailability: builder.query<ApiResponse<CheckAvailabilityResponse>, CheckAvailabilityRequest>({
      query: (params) => {
        const { venueId, ...rest } = params;
        const queryParams = new URLSearchParams(rest as any);
        return `/venues/${venueId}/availability?${queryParams.toString()}`;
      },
    }),
    createBooking: builder.mutation<ApiResponse<{ booking: Booking }>, CreateBookingRequest>({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Bookings', 'MyBookings'],
    }),
    getMyBookings: builder.query<ApiResponse<Booking[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.status) queryParams.append('status', params.status);
        return `/bookings/my-bookings?${queryParams.toString()}`;
      },
      providesTags: ['MyBookings'],
    }),
    getBooking: builder.query<ApiResponse<{ booking: Booking }>, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    updateBooking: builder.mutation<ApiResponse<{ booking: Booking }>, { id: string; data: Partial<CreateBookingRequest> }>({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Bookings', 'MyBookings'],
    }),
    cancelBooking: builder.mutation<ApiResponse<{ booking: Booking }>, string>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings', 'MyBookings'],
    }),
    confirmBooking: builder.mutation<ApiResponse<{ booking: Booking }>, string>({
      query: (id) => ({
        url: `/bookings/${id}/confirm`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings', 'MyBookings'],
    }),
    checkInBooking: builder.mutation<ApiResponse<{ booking: Booking }>, string>({
      query: (id) => ({
        url: `/bookings/${id}/check-in`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings', 'MyBookings'],
    }),
    checkOutBooking: builder.mutation<ApiResponse<{ booking: Booking }>, string>({
      query: (id) => ({
        url: `/bookings/${id}/check-out`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings', 'MyBookings'],
    }),
  }),
});

export const {
  useGetVenuesQuery,
  useGetVenueQuery,
  useCheckAvailabilityQuery,
  useLazyCheckAvailabilityQuery,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingQuery,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useConfirmBookingMutation,
  useCheckInBookingMutation,
  useCheckOutBookingMutation,
} = venueApi;
