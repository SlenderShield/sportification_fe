import { IRepository } from '@core';
import { Match, CreateMatchRequest, MatchFilters } from '../types';
import { matchApi } from '../store';

/**
 * Match Repository
 * 
 * Implements the repository pattern for Match entities.
 * Abstracts data access and provides a clean API for match operations.
 * 
 * @implements {IRepository<Match>}
 */
export class MatchRepository implements IRepository<Match> {
  /**
   * Get a match by ID
   */
  async getById(id: string): Promise<Match> {
    const result = await matchApi.endpoints.getMatchById.initiate(id);
    return result.data as Match;
  }

  /**
   * Get all matches with optional filters
   */
  async getAll(params?: MatchFilters): Promise<Match[]> {
    const result = await matchApi.endpoints.getMatches.initiate(params || {});
    const data = result.data as any;
    return data?.data?.items || [];
  }

  /**
   * Create a new match
   */
  async create(data: Partial<Match>): Promise<Match> {
    const result = await matchApi.endpoints.createMatch.initiate(data as CreateMatchRequest);
    return result.data as Match;
  }

  /**
   * Update an existing match
   */
  async update(id: string, data: Partial<Match>): Promise<Match> {
    const result = await matchApi.endpoints.updateMatch.initiate({ id, ...data });
    return result.data as Match;
  }

  /**
   * Delete a match
   */
  async delete(id: string): Promise<void> {
    await matchApi.endpoints.deleteMatch.initiate(id);
  }

  /**
   * Join a match
   */
  async joinMatch(matchId: string): Promise<void> {
    await matchApi.endpoints.joinMatch.initiate(matchId);
  }

  /**
   * Leave a match
   */
  async leaveMatch(matchId: string): Promise<void> {
    await matchApi.endpoints.leaveMatch.initiate(matchId);
  }

  /**
   * Update match score
   */
  async updateScore(matchId: string, score: { team1Score: number; team2Score: number }): Promise<Match> {
    const result = await matchApi.endpoints.updateScore.initiate({ matchId, ...score });
    return result.data as Match;
  }
}

/**
 * Singleton instance of MatchRepository
 */
export const matchRepository = new MatchRepository();
