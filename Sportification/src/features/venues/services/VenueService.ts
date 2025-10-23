import { IService, BusinessError, logger } from '@core';
import { Venue } from '../types';
import { VenueRepository } from '../repositories/VenueRepository';

export interface IVenueService extends IService {
  getVenues(filters?: any): Promise<Venue[]>;
  getVenueById(id: string): Promise<Venue>;
  createVenue(data: Partial<Venue>): Promise<Venue>;
  updateVenue(id: string, data: Partial<Venue>): Promise<Venue>;
  deleteVenue(id: string): Promise<void>;
  bookVenue(venueId: string, bookingData: any): Promise<any>;
  checkAvailability(venueId: string, date: string): Promise<any>;
}

export class VenueService implements IVenueService {
  constructor(private repository: VenueRepository) {}

  async initialize(): Promise<void> {
    logger.info('VenueService initialized');
  }

  cleanup(): void {
    logger.info('VenueService cleanup');
  }

  async getVenues(filters?: any): Promise<Venue[]> {
    try {
      return await this.repository.getAll(filters);
    } catch (error) {
      logger.error('Failed to get venues', error as Error, { filters });
      throw error;
    }
  }

  async getVenueById(id: string): Promise<Venue> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      logger.error('Failed to get venue', error as Error, { id });
      throw error;
    }
  }

  async createVenue(data: Partial<Venue>): Promise<Venue> {
    try {
      if (!data.name || data.name.trim().length < 3) {
        throw new BusinessError('Venue name must be at least 3 characters');
      }

      if (!data.location) {
        throw new BusinessError('Venue location is required');
      }

      const venue = await this.repository.create(data);
      logger.info('Venue created', { venueId: venue.id });
      return venue;
    } catch (error) {
      logger.error('Failed to create venue', error as Error, { data });
      throw error;
    }
  }

  async updateVenue(id: string, data: Partial<Venue>): Promise<Venue> {
    try {
      const venue = await this.repository.update(id, data);
      logger.info('Venue updated', { venueId: id });
      return venue;
    } catch (error) {
      logger.error('Failed to update venue', error as Error, { id, data });
      throw error;
    }
  }

  async deleteVenue(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
      logger.info('Venue deleted', { venueId: id });
    } catch (error) {
      logger.error('Failed to delete venue', error as Error, { id });
      throw error;
    }
  }

  async bookVenue(venueId: string, bookingData: any): Promise<any> {
    try {
      // Check availability first
      const availability = await this.repository.getAvailability(venueId, bookingData.date);
      
      if (!availability.available) {
        throw new BusinessError('Venue is not available for the selected time');
      }

      const booking = await this.repository.bookVenue(venueId, bookingData);
      logger.info('Venue booked', { venueId, bookingId: booking.id });
      return booking;
    } catch (error) {
      logger.error('Failed to book venue', error as Error, { venueId, bookingData });
      throw error;
    }
  }

  async checkAvailability(venueId: string, date: string): Promise<any> {
    try {
      return await this.repository.getAvailability(venueId, date);
    } catch (error) {
      logger.error('Failed to check availability', error as Error, { venueId, date });
      throw error;
    }
  }
}

export const venueService = new VenueService(new VenueRepository());
