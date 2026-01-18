/**
 * Entité métier représentant un enregistrement de pluviométrie
 */
export interface RainfallEntry {
  id?: number;
  date: string; // Format ISO 8601 (YYYY-MM-DD)
  amount: number; // Quantité en millimètres (mm)
  createdAt?: string; // Horodatage de création (ISO 8601)
}

/**
 * Crée une nouvelle entrée de pluviométrie
 */
export function createRainfallEntry(
  date: string,
  amount: number
): RainfallEntry {
  return {
    date,
    amount,
    createdAt: new Date().toISOString(),
  };
}
