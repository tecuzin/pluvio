import { RainfallEntry } from '../entities/RainfallEntry';

/**
 * Interface du repository pour la gestion des enregistrements de pluviométrie
 * Suit le principe d'inversion de dépendance (DIP)
 */
export interface IRainfallRepository {
  /**
   * Sauvegarde un enregistrement de pluviométrie
   * @param entry L'entrée à sauvegarder
   * @returns L'entrée sauvegardée avec son ID
   */
  save(entry: RainfallEntry): Promise<RainfallEntry>;

  /**
   * Récupère tous les enregistrements
   * @returns Liste des enregistrements triés par date décroissante
   */
  findAll(): Promise<RainfallEntry[]>;

  /**
   * Récupère un enregistrement par date
   * @param date Date au format YYYY-MM-DD
   * @returns L'enregistrement ou null si non trouvé
   */
  findByDate(date: string): Promise<RainfallEntry | null>;

  /**
   * Récupère les enregistrements dans une plage de dates
   * @param startDate Date de début (incluse)
   * @param endDate Date de fin (incluse)
   * @returns Liste des enregistrements triés par date décroissante
   */
  findByDateRange(startDate: string, endDate: string): Promise<RainfallEntry[]>;
}
