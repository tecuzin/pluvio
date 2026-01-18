import { createRainfallEntry, RainfallEntry } from '@domain/entities/RainfallEntry';

describe('RainfallEntry', () => {
  describe('createRainfallEntry', () => {
    it('should create a rainfall entry with date and amount', () => {
      // Arrange
      const date = '2026-01-17';
      const amount = 12.5;

      // Act
      const entry = createRainfallEntry(date, amount);

      // Assert
      expect(entry.date).toBe(date);
      expect(entry.amount).toBe(amount);
      expect(entry.createdAt).toBeDefined();
      expect(typeof entry.createdAt).toBe('string');
    });

    it('should create entry with 0 mm amount', () => {
      // Arrange
      const date = '2026-01-17';
      const amount = 0;

      // Act
      const entry = createRainfallEntry(date, amount);

      // Assert
      expect(entry.amount).toBe(0);
    });

    it('should set createdAt timestamp', () => {
      // Arrange
      const before = new Date().toISOString();
      const date = '2026-01-17';
      const amount = 5.2;

      // Act
      const entry = createRainfallEntry(date, amount);
      const after = new Date().toISOString();

      // Assert
      expect(entry.createdAt).toBeDefined();
      if (entry.createdAt) {
        expect(entry.createdAt >= before).toBe(true);
        expect(entry.createdAt <= after).toBe(true);
      }
    });
  });
});
