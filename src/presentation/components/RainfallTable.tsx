import { RainfallEntry } from '@domain/entities/RainfallEntry';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RainfallTableProps {
  entries: RainfallEntry[];
}

export function RainfallTable({ entries }: RainfallTableProps) {
  if (entries.length === 0) {
    return (
      <div className="rainfall-table empty">
        <p>Aucune donnée enregistrée</p>
      </div>
    );
  }

  return (
    <div className="rainfall-table">
      <h2>Historique des mesures</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Quantité (mm)</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id || entry.date}>
              <td>
                {format(parseISO(entry.date), 'dd MMMM yyyy', { locale: fr })}
              </td>
              <td>{entry.amount.toFixed(1)} mm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
