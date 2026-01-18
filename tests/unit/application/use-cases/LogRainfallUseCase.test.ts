import { LogRainfallUseCase } from '@application/use-cases/LogRainfallUseCase';
import { IRainfallRepository } from '@domain/repositories/IRainfallRepository';
import { RainfallEntry } from '@domain/entities/RainfallEntry';
import { RainfallValidationError } from '@domain/validators/RainfallValidator';

describe('LogRainfallUseCase', () => {
  let mockRepository: jest.Mocked<IRainfallRepository>;
  let useCase: LogRainfallUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByDate: jest.fn(),
      findByDateRange: jest.fn(),
    };
    useCase = new LogRainfallUseCase(mockRepository);
  });

  it('should save a valid rainfall entry', async () => {
    // Arrange
    const date = '2026-01-17';
    const amount = 12.5;
    const savedEntry: RainfallEntry = {
      id: 1,
      date,
      amount,
      createdAt: new Date().toISOString(),
    };
    mockRepository.save.mockResolvedValue(savedEntry);

    // Act
    const result = await useCase.execute(date, amount);

    // Assert
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual(savedEntry);
    expect(result.date).toBe(date);
    expect(result.amount).toBe(amount);
  });

  it('should throw error for negative amount', async () => {
    // Arrange
    const date = '2026-01-17';
    const amount = -5;

    // Act & Assert
    await expect(useCase.execute(date, amount)).rejects.toThrow(
      RainfallValidationError
    );
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for invalid date', async () => {
    // Arrange
    const date = 'invalid-date';
    const amount = 12.5;

    // Act & Assert
    await expect(useCase.execute(date, amount)).rejects.toThrow(
      RainfallValidationError
    );
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for amount over 1000', async () => {
    // Arrange
    const date = '2026-01-17';
    const amount = 1001;

    // Act & Assert
    await expect(useCase.execute(date, amount)).rejects.toThrow(
      RainfallValidationError
    );
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
