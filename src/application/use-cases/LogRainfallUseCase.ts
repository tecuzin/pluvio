import { IRainfallRepository } from '@domain/repositories/IRainfallRepository';
import { RainfallEntry, createRainfallEntry } from '@domain/entities/RainfallEntry';
import { validateRainfallEntry } from '@domain/validators/RainfallValidator';

/**
 * Cas d'usage pour enregistrer une pluviométrie
 */
export class LogRainfallUseCase {
  constructor(private repository: IRainfallRepository) {}

  async execute(date: string, amount: number): Promise<RainfallEntry> {
    // Créer l'entité
    const entry = createRainfallEntry(date, amount);

    // Valider selon les règles métier
    validateRainfallEntry(entry);

    // Sauvegarder
    return await this.repository.save(entry);
  }
}
