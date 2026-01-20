import { useState, useEffect } from 'react';
import { RainfallForm } from './components/RainfallForm';
import { RainfallTable } from './components/RainfallTable';
import { RainfallChart } from './components/RainfallChart';
import { RainfallEntry } from '@domain/entities/RainfallEntry';
import { RainfallService } from '@infrastructure/services/RainfallService';
import { SQLiteRainfallRepository } from '@infrastructure/repositories/SQLiteRainfallRepository';
import {
  generateCsvContent,
  generateExportFilename,
  downloadCsv,
} from '@application/use-cases/ExportRainfallToCsvUseCase';

// Initialiser le service avec le repository
// Le repository s'initialise de manière asynchrone, donc on le fait dans un useEffect
let repository: SQLiteRainfallRepository | null = null;
let rainfallService: RainfallService | null = null;

function App() {
  const [entries, setEntries] = useState<RainfallEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Initialiser le repository et le service au montage
  useEffect(() => {
    const init = async () => {
      try {
        if (!repository) {
          repository = new SQLiteRainfallRepository();
          rainfallService = new RainfallService(repository);
        }
        await loadEntries();
      } catch (err) {
        setError('Erreur lors de l\'initialisation');
        console.error(err);
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const loadEntries = async () => {
    if (!rainfallService) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await rainfallService.getAllEntries();
      setEntries(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (entry: RainfallEntry) => {
    if (!rainfallService) {
      setError('Service non initialisé');
      return;
    }
    await rainfallService.logRainfall(entry.date, entry.amount);
    // Recharger les données après enregistrement
    await loadEntries();
  };

  const handleExportCsv = () => {
    setIsExporting(true);
    try {
      const csvContent = generateCsvContent(entries);
      const filename = generateExportFilename();
      downloadCsv(csvContent, filename);
    } catch (err) {
      setError('Erreur lors de l\'export CSV');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div className="app-loading">Chargement...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>Pluvio - Suivi de Pluviométrie</h1>
      </header>

      <main>
        {error && <div className="error-banner">{error}</div>}

        <div className="form-section">
          <RainfallForm onSubmit={handleSubmit} />
        </div>

        <div className="data-section">
          <div className="table-section">
            <div className="table-header">
              <RainfallTable entries={entries} />
              <button
                className="export-button"
                onClick={handleExportCsv}
                disabled={isExporting}
                aria-label="Exporter les données en CSV"
              >
                {isExporting ? 'Export en cours...' : 'Exporter CSV'}
              </button>
            </div>
          </div>

          <div className="chart-section">
            <RainfallChart entries={entries} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
