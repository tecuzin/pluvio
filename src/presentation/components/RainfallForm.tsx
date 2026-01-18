import { useState, FormEvent } from 'react';
import { RainfallEntry } from '@domain/entities/RainfallEntry';
import { RainfallValidationError } from '@domain/validators/RainfallValidator';
import { format } from 'date-fns';

interface RainfallFormProps {
  onSubmit: (entry: RainfallEntry) => Promise<void>;
}

export function RainfallForm({ onSubmit }: RainfallFormProps) {
  const [date, setDate] = useState(() => {
    return format(new Date(), 'yyyy-MM-dd');
  });
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum)) {
        throw new RainfallValidationError('La quantité doit être un nombre');
      }

      const entry: RainfallEntry = {
        date,
        amount: amountNum,
      };

      await onSubmit(entry);
      setSuccess('Pluviométrie enregistrée avec succès');
      setAmount(''); // Réinitialiser le champ quantité
      // Garder la date pour faciliter les saisies multiples
    } catch (err) {
      if (err instanceof RainfallValidationError) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de l\'enregistrement');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rainfall-form">
      <h2>Enregistrer une pluviométrie</h2>
      
      <div className="form-group">
        <label htmlFor="date">Date :</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Quantité (mm) :</label>
        <input
          id="amount"
          type="number"
          step="0.1"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="0.0"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}
