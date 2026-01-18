import { IRainfallRepository } from '@domain/repositories/IRainfallRepository';
import { RainfallEntry } from '@domain/entities/RainfallEntry';

/**
 * Cas d'usage pour récupérer tous les enregistrements de pluviométrie
 */
export class GetRainfallEntriesUseCase {
  constructor(private repository: IRainfallRepository) {}

  async execute(): Promise<RainfallEntry[]> {
    return await this.repository.findAll();
  }
}
