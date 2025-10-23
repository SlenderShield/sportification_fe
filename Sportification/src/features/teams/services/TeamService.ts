import { IService, BusinessError, logger } from '@core';
import { Team } from '../types';
import { TeamRepository } from '../repositories/TeamRepository';

/**
 * Team Service Interface
 */
export interface ITeamService extends IService {
  getTeams(filters?: any): Promise<Team[]>;
  getTeamById(id: string): Promise<Team>;
  createTeam(data: Partial<Team>): Promise<Team>;
  updateTeam(id: string, data: Partial<Team>): Promise<Team>;
  deleteTeam(id: string): Promise<void>;
  joinTeam(teamId: string): Promise<void>;
  leaveTeam(teamId: string): Promise<void>;
  inviteMember(teamId: string, userId: string): Promise<void>;
}

/**
 * Team Service
 * 
 * Handles business logic for team operations.
 * Enforces team-related business rules and validations.
 * 
 * @implements {ITeamService}
 */
export class TeamService implements ITeamService {
  constructor(private repository: TeamRepository) {}

  async initialize(): Promise<void> {
    logger.info('TeamService initialized');
  }

  cleanup(): void {
    logger.info('TeamService cleanup');
  }

  async getTeams(filters?: any): Promise<Team[]> {
    try {
      return await this.repository.getAll(filters);
    } catch (error) {
      logger.error('Failed to get teams', error as Error, { filters });
      throw error;
    }
  }

  async getTeamById(id: string): Promise<Team> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      logger.error('Failed to get team', error as Error, { id });
      throw error;
    }
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    try {
      // Business validation
      if (!data.name || data.name.trim().length < 3) {
        throw new BusinessError('Team name must be at least 3 characters');
      }

      if (data.members && data.members.length < 2) {
        throw new BusinessError('Team must have at least 2 members');
      }

      const team = await this.repository.create(data);
      logger.info('Team created', { teamId: team.id });
      return team;
    } catch (error) {
      logger.error('Failed to create team', error as Error, { data });
      throw error;
    }
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    try {
      const team = await this.repository.update(id, data);
      logger.info('Team updated', { teamId: id });
      return team;
    } catch (error) {
      logger.error('Failed to update team', error as Error, { id, data });
      throw error;
    }
  }

  async deleteTeam(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
      logger.info('Team deleted', { teamId: id });
    } catch (error) {
      logger.error('Failed to delete team', error as Error, { id });
      throw error;
    }
  }

  async joinTeam(teamId: string): Promise<void> {
    try {
      const team = await this.repository.getById(teamId);

      // Business rules
      if (team.members.length >= (team.maxMembers || 20)) {
        throw new BusinessError('Team is full');
      }

      await this.repository.joinTeam(teamId);
      logger.info('User joined team', { teamId });
    } catch (error) {
      logger.error('Failed to join team', error as Error, { teamId });
      throw error;
    }
  }

  async leaveTeam(teamId: string): Promise<void> {
    try {
      await this.repository.leaveTeam(teamId);
      logger.info('User left team', { teamId });
    } catch (error) {
      logger.error('Failed to leave team', error as Error, { teamId });
      throw error;
    }
  }

  async inviteMember(teamId: string, userId: string): Promise<void> {
    try {
      const team = await this.repository.getById(teamId);

      if (team.members.length >= (team.maxMembers || 20)) {
        throw new BusinessError('Team is full');
      }

      await this.repository.inviteMember(teamId, userId);
      logger.info('Member invited to team', { teamId, userId });
    } catch (error) {
      logger.error('Failed to invite member', error as Error, { teamId, userId });
      throw error;
    }
  }
}

/**
 * Singleton instance of TeamService
 */
export const teamService = new TeamService(new TeamRepository());
