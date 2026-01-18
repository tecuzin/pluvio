import { RainfallEntry } from '@domain/entities/RainfallEntry';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RainfallChartProps {
  entries: RainfallEntry[];
}

export function RainfallChart({ entries }: RainfallChartProps) {
  if (entries.length === 0) {
    return (
      <div className="rainfall-chart empty">
        <p>Aucune donnée à afficher</p>
      </div>
    );
  }

  // Préparer les données pour le graphique
  const chartData = entries
    .map((entry) => ({
      date: entry.date,
      dateFormatted: format(parseISO(entry.date), 'dd/MM', { locale: fr }),
      amount: entry.amount,
    }))
    .reverse(); // Inverser pour afficher du plus ancien au plus récent

  return (
    <div className="rainfall-chart">
      <h2>Évolution de la pluviométrie</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateFormatted"
            label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: 'mm', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} mm`, 'Pluviométrie']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
