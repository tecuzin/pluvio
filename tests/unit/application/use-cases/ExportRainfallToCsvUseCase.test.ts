import {
  ExportRainfallToCsvUseCase,
  generateCsvContent,
  escapeCsvField,
  generateExportFilename,
} from '@application/use-cases/ExportRainfallToCsvUseCase';
import { IRainfallRepository } from '@domain/repositories/IRainfallRepository';
import { RainfallEntry } from '@domain/entities/RainfallEntry';

describe('ExportRainfallToCsvUseCase', () => {
  let mockRepository: jest.Mocked<IRainfallRepository>;
  let useCase: ExportRainfallToCsvUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByDateRange: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new ExportRainfallToCsvUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should generate CSV content from entries', async () => {
      // Arrange
      const entries: RainfallEntry[] = [
        { id: 1, date: '2026-01-15', amount: 5.5 },
        { id: 2, date: '2026-01-16', amount: 12.3 },
      ];
      mockRepository.findAll.mockResolvedValue(entries);

      // Act
      const csv = await useCase.execute();

      // Assert
      expect(csv).toContain('\uFEFF'); // BOM UTF-8
      expect(csv).toContain('Date;Quantité (mm);Localisation;Notes');
      expect(csv).toContain('2026-01-15;5.5');
      expect(csv).toContain('2026-01-16;12.3');
    });

    it('should generate CSV with headers only when no entries', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue([]);

      // Act
      const csv = await useCase.execute();

      // Assert
      expect(csv).toContain('\uFEFF');
      expect(csv).toContain('Date;Quantité (mm);Localisation;Notes');
      // Pas de lignes de données supplémentaires
      const lines = csv.split('\n');
      expect(lines.length).toBe(1); // Seulement les en-têtes
    });

    it('should call repository findAll', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue([]);

      // Act
      await useCase.execute();

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

describe('generateCsvContent', () => {
  it('should start with UTF-8 BOM', () => {
    const csv = generateCsvContent([]);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
  });

  it('should include headers', () => {
    const csv = generateCsvContent([]);
    expect(csv).toContain('Date;Quantité (mm);Localisation;Notes');
  });

  it('should use semicolon as separator', () => {
    const entries: RainfallEntry[] = [
      { id: 1, date: '2026-01-18', amount: 10 },
    ];
    const csv = generateCsvContent(entries);
    expect(csv).toContain('2026-01-18;10');
  });

  it('should format entries correctly', () => {
    const entries: RainfallEntry[] = [
      { id: 1, date: '2026-01-18', amount: 5.5 },
      { id: 2, date: '2026-01-19', amount: 0 },
    ];
    const csv = generateCsvContent(entries);
    
    const lines = csv.split('\n');
    expect(lines.length).toBe(3); // Headers + 2 entries
    expect(lines[1]).toBe('2026-01-18;5.5;;');
    expect(lines[2]).toBe('2026-01-19;0;;');
  });
});

describe('escapeCsvField', () => {
  it('should return empty string for empty input', () => {
    expect(escapeCsvField('')).toBe('');
  });

  it('should return field as-is when no special characters', () => {
    expect(escapeCsvField('Paris')).toBe('Paris');
  });

  it('should escape field with semicolon', () => {
    expect(escapeCsvField('Paris; France')).toBe('"Paris; France"');
  });

  it('should escape field with quotes', () => {
    expect(escapeCsvField('Pluie "forte"')).toBe('"Pluie ""forte"""');
  });

  it('should escape field with newline', () => {
    expect(escapeCsvField('Ligne 1\nLigne 2')).toBe('"Ligne 1\nLigne 2"');
  });

  it('should handle multiple special characters', () => {
    expect(escapeCsvField('Test; "avec" tout')).toBe('"Test; ""avec"" tout"');
  });
});

describe('generateExportFilename', () => {
  it('should follow naming convention', () => {
    const filename = generateExportFilename();
    expect(filename).toMatch(/^pluvio-export-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  it('should include current date', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const filename = generateExportFilename();
    expect(filename).toBe(`pluvio-export-${year}-${month}-${day}.csv`);
  });

  it('should have .csv extension', () => {
    const filename = generateExportFilename();
    expect(filename).toMatch(/\.csv$/);
  });
});
