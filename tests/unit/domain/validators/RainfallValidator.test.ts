import {
  validateRainfallEntry,
  validateDate,
  validateAmount,
  RainfallValidationError,
} from '@domain/validators/RainfallValidator';
import { createRainfallEntry } from '@domain/entities/RainfallEntry';

describe('RainfallValidator', () => {
  describe('validateRainfallEntry', () => {
    it('should validate a valid entry', () => {
      // Arrange
      const entry = createRainfallEntry('2026-01-17', 12.5);

      // Act & Assert
      expect(() => validateRainfallEntry(entry)).not.toThrow();
    });

    it('should throw error for invalid date', () => {
      // Arrange
      const entry = createRainfallEntry('invalid-date', 12.5);

      // Act & Assert
      expect(() => validateRainfallEntry(entry)).toThrow(RainfallValidationError);
    });

    it('should throw error for negative amount', () => {
      // Arrange
      const entry = createRainfallEntry('2026-01-17', -5);

      // Act & Assert
      expect(() => validateRainfallEntry(entry)).toThrow(RainfallValidationError);
      expect(() => validateRainfallEntry(entry)).toThrow('négative');
    });
  });

  describe('validateDate', () => {
    it('should accept valid ISO date', () => {
      expect(() => validateDate('2026-01-17')).not.toThrow();
    });

    it('should reject empty date', () => {
      expect(() => validateDate('')).toThrow(RainfallValidationError);
    });

    it('should reject invalid format', () => {
      expect(() => validateDate('17/01/2026')).toThrow(RainfallValidationError);
      expect(() => validateDate('2026-13-45')).toThrow(RainfallValidationError);
    });

    it('should reject date too far in future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      expect(() => validateDate(futureDateStr)).toThrow(RainfallValidationError);
      expect(() => validateDate(futureDateStr)).toThrow('futur');
    });

    it('should accept date up to 1 day in future', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      expect(() => validateDate(tomorrowStr)).not.toThrow();
    });

    it('should accept past dates', () => {
      const pastDate = '2025-01-01';
      expect(() => validateDate(pastDate)).not.toThrow();
    });
  });

  describe('validateAmount', () => {
    it('should accept valid amount', () => {
      expect(() => validateAmount(0)).not.toThrow();
      expect(() => validateAmount(12.5)).not.toThrow();
      expect(() => validateAmount(999.9)).not.toThrow();
    });

    it('should reject negative amount', () => {
      expect(() => validateAmount(-1)).toThrow(RainfallValidationError);
      expect(() => validateAmount(-1)).toThrow('négative');
    });

    it('should reject amount over 1000', () => {
      expect(() => validateAmount(1001)).toThrow(RainfallValidationError);
      expect(() => validateAmount(1001)).toThrow('suspecte');
    });

    it('should reject NaN', () => {
      expect(() => validateAmount(NaN)).toThrow(RainfallValidationError);
    });

    it('should reject non-number', () => {
      // @ts-expect-error Testing invalid input
      expect(() => validateAmount('12.5')).toThrow(RainfallValidationError);
    });
  });
});
