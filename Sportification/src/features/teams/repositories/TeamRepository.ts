import { IRepository } from '@core';
import { Team } from '../types';
import { teamApi } from '../store';

/**
 * Team Repository
 * 
 * Implements the repository pattern for Team entities.
 * Abstracts data access and provides a clean API for team operations.
 * 
 * @implements {IRepository<Team>}
 */
export class TeamRepository implements IRepository<Team> {
  /**
   * Get a team by ID
   */
  async getById(id: string): Promise<Team> {
    const result = await teamApi.endpoints.getTeamById.initiate(id);
    return result.data as Team;
  }

  /**
   * Get all teams with optional filters
   */
  async getAll(params?: any): Promise<Team[]> {
    const result = await teamApi.endpoints.getTeams.initiate(params || {});
    const data = result.data as any;
    return data?.data?.items || [];
  }

  /**
   * Create a new team
   */
  async create(data: Partial<Team>): Promise<Team> {
    const result = await teamApi.endpoints.createTeam.initiate(data);
    return result.data as Team;
  }

  /**
   * Update an existing team
   */
  async update(id: string, data: Partial<Team>): Promise<Team> {
    const result = await teamApi.endpoints.updateTeam.initiate({ id, ...data });
    return result.data as Team;
  }

  /**
   * Delete a team
   */
  async delete(id: string): Promise<void> {
    await teamApi.endpoints.deleteTeam.initiate(id);
  }

  /**
   * Join a team
   */
  async joinTeam(teamId: string): Promise<void> {
    await teamApi.endpoints.joinTeam.initiate(teamId);
  }

  /**
   * Leave a team
   */
  async leaveTeam(teamId: string): Promise<void> {
    await teamApi.endpoints.leaveTeam.initiate(teamId);
  }

  /**
   * Invite member to team
   */
  async inviteMember(teamId: string, userId: string): Promise<void> {
    await teamApi.endpoints.inviteMember.initiate({ teamId, userId });
  }
}

/**
 * Singleton instance of TeamRepository
 */
export const teamRepository = new TeamRepository();
