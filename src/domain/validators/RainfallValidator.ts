import { RainfallEntry } from '../entities/RainfallEntry';

export class RainfallValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RainfallValidationError';
  }
}

/**
 * Valide une entrée de pluviométrie selon les règles métier
 */
export function validateRainfallEntry(entry: RainfallEntry): void {
  validateDate(entry.date);
  validateAmount(entry.amount);
}

/**
 * Valide la date
 */
export function validateDate(date: string): void {
  if (!date || typeof date !== 'string') {
    throw new RainfallValidationError('La date est requise');
  }

  // Format ISO 8601 (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new RainfallValidationError('La date doit être au format YYYY-MM-DD');
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new RainfallValidationError('La date est invalide');
  }

  // Vérifier que la date n'est pas trop dans le futur (max +1 jour)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 1);
  
  const entryDate = new Date(date);
  entryDate.setHours(0, 0, 0, 0);

  if (entryDate > maxDate) {
    throw new RainfallValidationError('La date ne peut pas être plus de 1 jour dans le futur');
  }
}

/**
 * Valide la quantité de pluie
 */
export function validateAmount(amount: number): void {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new RainfallValidationError('La quantité doit être un nombre');
  }

  if (amount < 0) {
    throw new RainfallValidationError('La quantité ne peut pas être négative');
  }

  if (amount > 1000) {
    throw new RainfallValidationError('La quantité semble suspecte (supérieure à 1000 mm). Veuillez vérifier.');
  }
}
