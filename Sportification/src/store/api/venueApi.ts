import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { 
  Venue, 
  Booking, 
  CreateBookingRequest, 
  CheckAvailabilityRequest, 
  CheckAvailabilityResponse 
} from '../../types/venue';
import { ApiResponse, PaginatedResponse } from '../../types/api';
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
  tagTypes: ['Venue', 'Venues', 'Booking', 'Bookings'],
  endpoints: (builder) => ({
    getVenues: builder.query<ApiResponse<PaginatedResponse<Venue>>, { page?: number; limit?: number; sport?: string }>({
      query: ({ page = 1, limit = 10, sport }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (sport) params.append('sport', sport);
        return `/venues?${params.toString()}`;
      },
      providesTags: ['Venues'],
    }),
    getVenue: builder.query<ApiResponse<Venue>, string>({
      query: (id) => `/venues/${id}`,
      providesTags: (result, error, id) => [{ type: 'Venue', id }],
    }),
    checkAvailability: builder.mutation<ApiResponse<CheckAvailabilityResponse>, CheckAvailabilityRequest>({
      query: (data) => ({
        url: '/venues/bookings/check-availability',
        method: 'POST',
        body: data,
      }),
    }),
    createBooking: builder.mutation<ApiResponse<Booking>, CreateBookingRequest>({
      query: (bookingData) => ({
        url: '/venues/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Bookings'],
    }),
    getMyBookings: builder.query<ApiResponse<PaginatedResponse<Booking>>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/venues/bookings/my-bookings?page=${page}&limit=${limit}`,
      providesTags: ['Bookings'],
    }),
    getBooking: builder.query<ApiResponse<Booking>, string>({
      query: (id) => `/venues/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    updateBooking: builder.mutation<ApiResponse<Booking>, { id: string; data: Partial<CreateBookingRequest> }>({
      query: ({ id, data }) => ({
        url: `/venues/bookings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Bookings'],
    }),
    cancelBooking: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/venues/bookings/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings'],
    }),
    confirmBooking: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/venues/bookings/${id}/confirm`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings'],
    }),
    checkInBooking: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/venues/bookings/${id}/check-in`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings'],
    }),
    checkOutBooking: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/venues/bookings/${id}/check-out`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings'],
    }),
  }),
});

export const {
  useGetVenuesQuery,
  useGetVenueQuery,
  useCheckAvailabilityMutation,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingQuery,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useConfirmBookingMutation,
  useCheckInBookingMutation,
  useCheckOutBookingMutation,
} = venueApi;
