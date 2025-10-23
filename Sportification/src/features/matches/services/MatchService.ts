import { IService, BusinessError, logger } from '@core';
import { Match, CreateMatchRequest, MatchFilters } from '../types';
import { MatchRepository } from '../repositories/MatchRepository';

/**
 * Match Service Interface
 * 
 * Defines the contract for match-related business operations
 */
export interface IMatchService extends IService {
  getMatches(filters?: MatchFilters): Promise<Match[]>;
  getMatchById(id: string): Promise<Match>;
  createMatch(data: CreateMatchRequest): Promise<Match>;
  updateMatch(id: string, data: Partial<Match>): Promise<Match>;
  deleteMatch(id: string): Promise<void>;
  joinMatch(matchId: string): Promise<void>;
  leaveMatch(matchId: string): Promise<void>;
  updateScore(matchId: string, team1Score: number, team2Score: number): Promise<Match>;
  canJoinMatch(match: Match, userId: string): boolean;
}

/**
 * Match Service
 * 
 * Handles business logic for match operations.
 * Uses repository pattern for data access and enforces business rules.
 * 
 * @implements {IMatchService}
 */
export class MatchService implements IMatchService {
  constructor(
    private repository: MatchRepository
  ) {}

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    logger.info('MatchService initialized');
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    logger.info('MatchService cleanup');
  }

  /**
   * Get all matches with optional filters
   */
  async getMatches(filters?: MatchFilters): Promise<Match[]> {
    try {
      return await this.repository.getAll(filters);
    } catch (error) {
      logger.error('Failed to get matches', error as Error, { filters });
      throw error;
    }
  }

  /**
   * Get a match by ID
   */
  async getMatchById(id: string): Promise<Match> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      logger.error('Failed to get match', error as Error, { id });
      throw error;
    }
  }

  /**
   * Create a new match
   */
  async createMatch(data: CreateMatchRequest): Promise<Match> {
    try {
      // Business validation
      if (!data.title || data.title.trim().length < 3) {
        throw new BusinessError('Match title must be at least 3 characters');
      }

      if (data.maxParticipants < 2) {
        throw new BusinessError('Match must allow at least 2 participants');
      }

      const match = await this.repository.create(data);
      
      logger.info('Match created', { matchId: match.id });
      
      return match;
    } catch (error) {
      logger.error('Failed to create match', error as Error, { data });
      throw error;
    }
  }

  /**
   * Update an existing match
   */
  async updateMatch(id: string, data: Partial<Match>): Promise<Match> {
    try {
      const match = await this.repository.update(id, data);
      logger.info('Match updated', { matchId: id });
      return match;
    } catch (error) {
      logger.error('Failed to update match', error as Error, { id, data });
      throw error;
    }
  }

  /**
   * Delete a match
   */
  async deleteMatch(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
      logger.info('Match deleted', { matchId: id });
    } catch (error) {
      logger.error('Failed to delete match', error as Error, { id });
      throw error;
    }
  }

  /**
   * Join a match
   */
  async joinMatch(matchId: string): Promise<void> {
    try {
      const match = await this.repository.getById(matchId);

      // Business rule: Check if match is full
      if (match.participants.length >= match.maxParticipants) {
        throw new BusinessError('Match is full');
      }

      // Business rule: Check if match is cancelled
      if (match.status === 'cancelled') {
        throw new BusinessError('Cannot join a cancelled match');
      }

      // Business rule: Check if match is completed
      if (match.status === 'completed') {
        throw new BusinessError('Cannot join a completed match');
      }

      await this.repository.joinMatch(matchId);
      logger.info('User joined match', { matchId });
    } catch (error) {
      logger.error('Failed to join match', error as Error, { matchId });
      throw error;
    }
  }

  /**
   * Leave a match
   */
  async leaveMatch(matchId: string): Promise<void> {
    try {
      const match = await this.repository.getById(matchId);

      // Business rule: Cannot leave if match is in progress
      if (match.status === 'in_progress') {
        throw new BusinessError('Cannot leave a match in progress');
      }

      await this.repository.leaveMatch(matchId);
      logger.info('User left match', { matchId });
    } catch (error) {
      logger.error('Failed to leave match', error as Error, { matchId });
      throw error;
    }
  }

  /**
   * Update match score
   */
  async updateScore(matchId: string, team1Score: number, team2Score: number): Promise<Match> {
    try {
      // Business validation
      if (team1Score < 0 || team2Score < 0) {
        throw new BusinessError('Scores cannot be negative');
      }

      const match = await this.repository.updateScore(matchId, { team1Score, team2Score });
      logger.info('Match score updated', { matchId, team1Score, team2Score });
      
      return match;
    } catch (error) {
      logger.error('Failed to update score', error as Error, { matchId, team1Score, team2Score });
      throw error;
    }
  }

  /**
   * Check if a user can join a match
   */
  canJoinMatch(match: Match, userId: string): boolean {
    // Already a participant
    if (match.participants.some(p => p.id === userId)) {
      return false;
    }

    // Match is full
    if (match.participants.length >= match.maxParticipants) {
      return false;
    }

    // Match is not in the right status
    if (match.status !== 'scheduled') {
      return false;
    }

    return true;
  }
}

/**
 * Singleton instance of MatchService
 */
export const matchService = new MatchService(
  new (require('../repositories/MatchRepository').MatchRepository)()
);
