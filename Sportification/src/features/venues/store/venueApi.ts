import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@core/config';
import { 
  Venue, 
  Booking, 
  CreateBookingRequest, 
  CheckAvailabilityRequest, 
  CheckAvailabilityResponse 
} from '@features/venues/types';
import { ApiResponse } from '../../types/api';
import { apiService } from '@shared/services/api';
import { unwrapApiResponse, unwrapNestedData } from '../../utils/apiHelpers';

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
    getVenues: builder.query<Venue[], { page?: number; limit?: number; sport?: string; city?: string; search?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.sport) queryParams.append('sport', params.sport);
        if (params.city) queryParams.append('city', params.city);
        if (params.search) queryParams.append('search', params.search);
        return `/venues?${queryParams.toString()}`;
      },
      transformResponse: (response: ApiResponse<Venue[]>) => unwrapApiResponse(response),
      providesTags: ['Venues'],
    }),
    getVenue: builder.query<Venue, string>({
      query: (id) => `/venues/${id}`,
      transformResponse: (response: ApiResponse<{ venue: Venue }>) => unwrapNestedData(response, 'venue'),
      providesTags: (result, error, id) => [{ type: 'Venue', id }],
    }),
    checkAvailability: builder.query<CheckAvailabilityResponse, CheckAvailabilityRequest>({
      query: (params) => {
        const { venueId, ...rest } = params;
        const queryParams = new URLSearchParams(rest as any);
        return `/venues/${venueId}/availability?${queryParams.toString()}`;
      },
      transformResponse: (response: ApiResponse<CheckAvailabilityResponse>) => unwrapApiResponse(response),
    }),
    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      transformResponse: (response: ApiResponse<{ booking: Booking }>) => unwrapNestedData(response, 'booking'),
      invalidatesTags: ['Bookings', 'MyBookings'],
    }),
    getMyBookings: builder.query<Booking[], { page?: number; limit?: number; status?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.status) queryParams.append('status', params.status);
        return `/bookings/my-bookings?${queryParams.toString()}`;
      },
      transformResponse: (response: ApiResponse<Booking[]>) => unwrapApiResponse(response),
      providesTags: ['MyBookings'],
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => `/bookings/${id}`,
      transformResponse: (response: ApiResponse<{ booking: Booking }>) => unwrapNestedData(response, 'booking'),
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    updateBooking: builder.mutation<Booking, { id: string; data: Partial<CreateBookingRequest> }>({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: ApiResponse<{ booking: Booking }>) => unwrapNestedData(response, 'booking'),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Bookings', 'MyBookings'],
    }),
    cancelBooking: builder.mutation<Booking, string>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ booking: Booking }>) => unwrapNestedData(response, 'booking'),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings', 'MyBookings'],
    }),
    confirmBooking: builder.mutation<Booking, string>({
      query: (id) => ({
        url: `/bookings/${id}/confirm`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ booking: Booking }>) => unwrapNestedData(response, 'booking'),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings', 'MyBookings'],
    }),
    checkInBooking: builder.mutation<Booking, string>({
      query: (id) => ({
        url: `/bookings/${id}/check-in`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ booking: Booking }>) => unwrapNestedData(response, 'booking'),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Bookings', 'MyBookings'],
    }),
    checkOutBooking: builder.mutation<Booking, string>({
      query: (id) => ({
        url: `/bookings/${id}/check-out`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ booking: Booking }>) => unwrapNestedData(response, 'booking'),
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
