import { IRepository } from '@core';
import { Venue } from '../types';
import { venueApi } from '../store';

/**
 * Venue Repository
 */
export class VenueRepository implements IRepository<Venue> {
  async getById(id: string): Promise<Venue> {
    const result = await venueApi.endpoints.getVenueById.initiate(id);
    return result.data as Venue;
  }

  async getAll(params?: any): Promise<Venue[]> {
    const result = await venueApi.endpoints.getVenues.initiate(params || {});
    const data = result.data as any;
    return data?.data?.items || [];
  }

  async create(data: Partial<Venue>): Promise<Venue> {
    const result = await venueApi.endpoints.createVenue.initiate(data);
    return result.data as Venue;
  }

  async update(id: string, data: Partial<Venue>): Promise<Venue> {
    const result = await venueApi.endpoints.updateVenue.initiate({ id, ...data });
    return result.data as Venue;
  }

  async delete(id: string): Promise<void> {
    await venueApi.endpoints.deleteVenue.initiate(id);
  }

  async bookVenue(venueId: string, bookingData: any): Promise<any> {
    const result = await venueApi.endpoints.bookVenue.initiate({ venueId, ...bookingData });
    return result.data;
  }

  async getAvailability(venueId: string, date: string): Promise<any> {
    const result = await venueApi.endpoints.getAvailability.initiate({ venueId, date });
    return result.data;
  }
}

export const venueRepository = new VenueRepository();
