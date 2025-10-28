import { IRepository } from '@core';
import { Tournament } from '../types';
import { tournamentApi } from '../store';

/**
 * Tournament Repository
 */
export class TournamentRepository implements IRepository<Tournament> {
  async getById(id: string): Promise<Tournament> {
    const result = await tournamentApi.endpoints.getTournamentById.initiate(id);
    return result.data as Tournament;
  }

  async getAll(params?: any): Promise<Tournament[]> {
    const result = await tournamentApi.endpoints.getTournaments.initiate(params || {});
    const data = result.data as any;
    return data?.data?.items || [];
  }

  async create(data: Partial<Tournament>): Promise<Tournament> {
    const result = await tournamentApi.endpoints.createTournament.initiate(data);
    return result.data as Tournament;
  }

  async update(id: string, data: Partial<Tournament>): Promise<Tournament> {
    const result = await tournamentApi.endpoints.updateTournament.initiate({ id, ...data });
    return result.data as Tournament;
  }

  async delete(id: string): Promise<void> {
    await tournamentApi.endpoints.deleteTournament.initiate(id);
  }

  async joinTournament(tournamentId: string): Promise<void> {
    await tournamentApi.endpoints.joinTournament.initiate(tournamentId);
  }

  async startTournament(tournamentId: string): Promise<Tournament> {
    const result = await tournamentApi.endpoints.startTournament.initiate(tournamentId);
    return result.data as Tournament;
  }
}

export const tournamentRepository = new TournamentRepository();
