import { LogRainfallUseCase } from '@application/use-cases/LogRainfallUseCase';
import { GetRainfallEntriesUseCase } from '@application/use-cases/GetRainfallEntriesUseCase';
import { IRainfallRepository } from '@domain/repositories/IRainfallRepository';
import { RainfallEntry } from '@domain/entities/RainfallEntry';

/**
 * Service pour gérer les opérations de pluviométrie
 * Facilite l'utilisation des use cases dans les composants React
 */
export class RainfallService {
  private logRainfallUseCase: LogRainfallUseCase;
  private getRainfallEntriesUseCase: GetRainfallEntriesUseCase;

  constructor(repository: IRainfallRepository) {
    this.logRainfallUseCase = new LogRainfallUseCase(repository);
    this.getRainfallEntriesUseCase = new GetRainfallEntriesUseCase(repository);
  }

  async logRainfall(date: string, amount: number): Promise<RainfallEntry> {
    return await this.logRainfallUseCase.execute(date, amount);
  }

  async getAllEntries(): Promise<RainfallEntry[]> {
    return await this.getRainfallEntriesUseCase.execute();
  }
}
