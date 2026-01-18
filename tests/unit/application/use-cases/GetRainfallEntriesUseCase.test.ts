import { GetRainfallEntriesUseCase } from '@application/use-cases/GetRainfallEntriesUseCase';
import { IRainfallRepository } from '@domain/repositories/IRainfallRepository';
import { RainfallEntry } from '@domain/entities/RainfallEntry';

describe('GetRainfallEntriesUseCase', () => {
  let mockRepository: jest.Mocked<IRainfallRepository>;
  let useCase: GetRainfallEntriesUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByDate: jest.fn(),
      findByDateRange: jest.fn(),
    };
    useCase = new GetRainfallEntriesUseCase(mockRepository);
  });

  it('should return all entries from repository', async () => {
    // Arrange
    const entries: RainfallEntry[] = [
      {
        id: 1,
        date: '2026-01-17',
        amount: 12.5,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        date: '2026-01-16',
        amount: 8.0,
        createdAt: new Date().toISOString(),
      },
    ];
    mockRepository.findAll.mockResolvedValue(entries);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(entries);
  });

  it('should return empty array when no entries', async () => {
    // Arrange
    mockRepository.findAll.mockResolvedValue([]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
