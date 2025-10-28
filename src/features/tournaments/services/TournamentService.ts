import { IService, BusinessError, logger } from '@core';
import { Tournament } from '../types';
import { TournamentRepository } from '../repositories/TournamentRepository';

export interface ITournamentService extends IService {
  getTournaments(filters?: any): Promise<Tournament[]>;
  getTournamentById(id: string): Promise<Tournament>;
  createTournament(data: Partial<Tournament>): Promise<Tournament>;
  updateTournament(id: string, data: Partial<Tournament>): Promise<Tournament>;
  deleteTournament(id: string): Promise<void>;
  joinTournament(tournamentId: string): Promise<void>;
  startTournament(tournamentId: string): Promise<Tournament>;
}

export class TournamentService implements ITournamentService {
  constructor(private repository: TournamentRepository) {}

  async initialize(): Promise<void> {
    logger.info('TournamentService initialized');
  }

  cleanup(): void {
    logger.info('TournamentService cleanup');
  }

  async getTournaments(filters?: any): Promise<Tournament[]> {
    try {
      return await this.repository.getAll(filters);
    } catch (error) {
      logger.error('Failed to get tournaments', error as Error, { filters });
      throw error;
    }
  }

  async getTournamentById(id: string): Promise<Tournament> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      logger.error('Failed to get tournament', error as Error, { id });
      throw error;
    }
  }

  async createTournament(data: Partial<Tournament>): Promise<Tournament> {
    try {
      if (!data.name || data.name.trim().length < 3) {
        throw new BusinessError('Tournament name must be at least 3 characters');
      }

      if (data.maxTeams && data.maxTeams < 4) {
        throw new BusinessError('Tournament must allow at least 4 teams');
      }

      const tournament = await this.repository.create(data);
      logger.info('Tournament created', { tournamentId: tournament.id });
      return tournament;
    } catch (error) {
      logger.error('Failed to create tournament', error as Error, { data });
      throw error;
    }
  }

  async updateTournament(id: string, data: Partial<Tournament>): Promise<Tournament> {
    try {
      const tournament = await this.repository.update(id, data);
      logger.info('Tournament updated', { tournamentId: id });
      return tournament;
    } catch (error) {
      logger.error('Failed to update tournament', error as Error, { id, data });
      throw error;
    }
  }

  async deleteTournament(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
      logger.info('Tournament deleted', { tournamentId: id });
    } catch (error) {
      logger.error('Failed to delete tournament', error as Error, { id });
      throw error;
    }
  }

  async joinTournament(tournamentId: string): Promise<void> {
    try {
      const tournament = await this.repository.getById(tournamentId);

      if (tournament.status !== 'registration') {
        throw new BusinessError('Tournament registration is closed');
      }

      if (tournament.teams.length >= tournament.maxTeams) {
        throw new BusinessError('Tournament is full');
      }

      await this.repository.joinTournament(tournamentId);
      logger.info('Joined tournament', { tournamentId });
    } catch (error) {
      logger.error('Failed to join tournament', error as Error, { tournamentId });
      throw error;
    }
  }

  async startTournament(tournamentId: string): Promise<Tournament> {
    try {
      const tournament = await this.repository.getById(tournamentId);

      if (tournament.teams.length < 4) {
        throw new BusinessError('Tournament needs at least 4 teams to start');
      }

      if (tournament.status !== 'registration') {
        throw new BusinessError('Tournament cannot be started');
      }

      const startedTournament = await this.repository.startTournament(tournamentId);
      logger.info('Tournament started', { tournamentId });
      return startedTournament;
    } catch (error) {
      logger.error('Failed to start tournament', error as Error, { tournamentId });
      throw error;
    }
  }
}

export const tournamentService = new TournamentService(new TournamentRepository());
