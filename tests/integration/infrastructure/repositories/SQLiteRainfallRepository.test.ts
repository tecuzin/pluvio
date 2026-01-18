import { SQLiteRainfallRepository } from '@infrastructure/repositories/SQLiteRainfallRepository';
import { createRainfallEntry } from '@domain/entities/RainfallEntry';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('SQLiteRainfallRepository', () => {
  let repository: SQLiteRainfallRepository;
  let testDbPath: string;

  beforeEach(() => {
    // Créer une base de données de test isolée
    testDbPath = path.join(__dirname, '../../../../test-pluvio.db');
    // Supprimer la base de test si elle existe
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    repository = new SQLiteRainfallRepository(testDbPath);
  });

  afterEach(() => {
    repository.close();
    // Nettoyer la base de test
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('save', () => {
    it('should save a rainfall entry', async () => {
      // Arrange
      const entry = createRainfallEntry('2026-01-17', 12.5);

      // Act
      const saved = await repository.save(entry);

      // Assert
      expect(saved.id).toBeDefined();
      expect(saved.date).toBe('2026-01-17');
      expect(saved.amount).toBe(12.5);
      expect(saved.createdAt).toBeDefined();
    });

    it('should replace entry if date already exists', async () => {
      // Arrange
      const entry1 = createRainfallEntry('2026-01-17', 12.5);
      const entry2 = createRainfallEntry('2026-01-17', 15.0);

      // Act
      await repository.save(entry1);
      const saved = await repository.save(entry2);

      // Assert
      expect(saved.amount).toBe(15.0);
      const all = await repository.findAll();
      expect(all.length).toBe(1);
    });

    it('should save entry with 0 mm', async () => {
      // Arrange
      const entry = createRainfallEntry('2026-01-17', 0);

      // Act
      const saved = await repository.save(entry);

      // Assert
      expect(saved.amount).toBe(0);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no entries', async () => {
      // Act
      const all = await repository.findAll();

      // Assert
      expect(all).toEqual([]);
    });

    it('should return all entries sorted by date descending', async () => {
      // Arrange
      await repository.save(createRainfallEntry('2026-01-15', 5.2));
      await repository.save(createRainfallEntry('2026-01-17', 12.5));
      await repository.save(createRainfallEntry('2026-01-16', 8.0));

      // Act
      const all = await repository.findAll();

      // Assert
      expect(all.length).toBe(3);
      expect(all[0].date).toBe('2026-01-17');
      expect(all[1].date).toBe('2026-01-16');
      expect(all[2].date).toBe('2026-01-15');
    });
  });

  describe('findByDate', () => {
    it('should return entry for existing date', async () => {
      // Arrange
      const entry = createRainfallEntry('2026-01-17', 12.5);
      await repository.save(entry);

      // Act
      const found = await repository.findByDate('2026-01-17');

      // Assert
      expect(found).not.toBeNull();
      expect(found?.date).toBe('2026-01-17');
      expect(found?.amount).toBe(12.5);
    });

    it('should return null for non-existing date', async () => {
      // Act
      const found = await repository.findByDate('2026-01-20');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findByDateRange', () => {
    it('should return entries in date range', async () => {
      // Arrange
      await repository.save(createRainfallEntry('2026-01-15', 5.2));
      await repository.save(createRainfallEntry('2026-01-16', 8.0));
      await repository.save(createRainfallEntry('2026-01-17', 12.5));
      await repository.save(createRainfallEntry('2026-01-18', 3.0));

      // Act
      const range = await repository.findByDateRange('2026-01-16', '2026-01-17');

      // Assert
      expect(range.length).toBe(2);
      expect(range[0].date).toBe('2026-01-17');
      expect(range[1].date).toBe('2026-01-16');
    });

    it('should return empty array when no entries in range', async () => {
      // Act
      const range = await repository.findByDateRange('2026-01-20', '2026-01-25');

      // Assert
      expect(range).toEqual([]);
    });
  });
});
