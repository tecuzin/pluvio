import { IRainfallRepository } from '@domain/repositories/IRainfallRepository';
import { RainfallEntry } from '@domain/entities/RainfallEntry';

/**
 * Cas d'usage pour exporter les données de pluviométrie au format CSV
 */
export class ExportRainfallToCsvUseCase {
  constructor(private repository: IRainfallRepository) {}

  /**
   * Génère le contenu CSV des données de pluviométrie
   * @returns Le contenu CSV avec BOM UTF-8 pour compatibilité Excel
   */
  async execute(): Promise<string> {
    const entries = await this.repository.findAll();
    return generateCsvContent(entries);
  }
}

/**
 * Génère le contenu CSV à partir des entrées de pluviométrie
 * @param entries Les entrées à exporter
 * @returns Le contenu CSV formaté
 */
export function generateCsvContent(entries: RainfallEntry[]): string {
  // BOM UTF-8 pour compatibilité Excel
  const BOM = '\uFEFF';
  
  // En-têtes
  const headers = ['Date', 'Quantité (mm)', 'Localisation', 'Notes'];
  
  // Lignes de données
  const rows = entries.map(entry => [
    entry.date,
    entry.amount.toString(),
    escapeCsvField(''), // Localisation non implémentée dans l'entité actuelle
    escapeCsvField(''), // Notes non implémentées dans l'entité actuelle
  ]);
  
  // Assembler le CSV avec séparateur point-virgule
  const csvLines = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ];
  
  return BOM + csvLines.join('\n');
}

/**
 * Échappe un champ CSV selon la RFC 4180
 * - Encadre par des guillemets si le champ contient des caractères spéciaux
 * - Double les guillemets internes
 * @param field Le champ à échapper
 * @returns Le champ échappé
 */
export function escapeCsvField(field: string): string {
  if (!field) return '';
  
  // Vérifier si le champ contient des caractères nécessitant l'échappement
  const needsEscaping = field.includes(';') || 
                        field.includes('"') || 
                        field.includes('\n') ||
                        field.includes('\r');
  
  if (needsEscaping) {
    // Doubler les guillemets et encadrer le champ
    return '"' + field.replace(/"/g, '""') + '"';
  }
  
  return field;
}

/**
 * Génère le nom du fichier d'export avec la date du jour
 * @returns Le nom du fichier au format pluvio-export-YYYY-MM-DD.csv
 */
export function generateExportFilename(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `pluvio-export-${year}-${month}-${day}.csv`;
}

/**
 * Déclenche le téléchargement d'un fichier CSV dans le navigateur
 * @param content Le contenu du fichier CSV
 * @param filename Le nom du fichier
 */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  // Nettoyage
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
