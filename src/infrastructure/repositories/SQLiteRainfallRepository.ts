import initSqlJs, { Database } from 'sql.js';
import { IRainfallRepository } from '@domain/repositories/IRainfallRepository';
import { RainfallEntry } from '@domain/entities/RainfallEntry';

/**
 * Repository SQLite pour la gestion des enregistrements de pluviométrie
 * Utilise sql.js pour fonctionner dans le navigateur
 */
export class SQLiteRainfallRepository implements IRainfallRepository {
  private db: Database | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initializeDatabase();
  }

  /**
   * Initialise la base de données
   */
  private async initializeDatabase(): Promise<void> {
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });

    // Charger depuis localStorage ou créer une nouvelle base
    const savedDb = localStorage.getItem('pluvio_db');
    if (savedDb) {
      const buffer = Uint8Array.from(atob(savedDb), (c) => c.charCodeAt(0));
      this.db = new SQL.Database(buffer);
    } else {
      this.db = new SQL.Database();
      this.createTable();
    }
  }

  /**
   * Crée la table si elle n'existe pas
   */
  private createTable(): void {
    if (!this.db) return;

    this.db.run(`
      CREATE TABLE IF NOT EXISTS rainfall_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        amount REAL NOT NULL CHECK(amount >= 0),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    this.saveToLocalStorage();
  }

  /**
   * Sauvegarde la base dans localStorage
   */
  private saveToLocalStorage(): void {
    if (!this.db) return;

    const data = this.db.export();
    const buffer = Array.from(data)
      .map((byte) => String.fromCharCode(byte))
      .join('');
    localStorage.setItem('pluvio_db', btoa(buffer));
  }

  /**
   * Attend que la base soit initialisée
   */
  private async ensureInitialized(): Promise<void> {
    await this.initPromise;
    if (!this.db) {
      throw new Error('Database not initialized');
    }
  }

  async save(entry: RainfallEntry): Promise<RainfallEntry> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    // Vérifier si une entrée existe déjà pour cette date
    const existing = this.db.exec(
      `SELECT id FROM rainfall_entries WHERE date = ?`,
      [entry.date]
    );

    const createdAt = entry.createdAt || new Date().toISOString();

    if (existing.length > 0 && existing[0].values.length > 0) {
      // Mettre à jour l'entrée existante
      this.db.run(
        `UPDATE rainfall_entries SET amount = ?, created_at = ? WHERE date = ?`,
        [entry.amount, createdAt, entry.date]
      );
      const id = existing[0].values[0][0] as number;
      this.saveToLocalStorage();
      return {
        ...entry,
        id,
        createdAt,
      };
    } else {
      // Insérer une nouvelle entrée
      this.db.run(
        `INSERT INTO rainfall_entries (date, amount, created_at) VALUES (?, ?, ?)`,
        [entry.date, entry.amount, createdAt]
      );
      const result = this.db.exec('SELECT last_insert_rowid() as id');
      const id = result[0]?.values[0]?.[0] as number;
      this.saveToLocalStorage();
      return {
        ...entry,
        id,
        createdAt,
      };
    }
  }

  async findAll(): Promise<RainfallEntry[]> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec(`
      SELECT id, date, amount, created_at as createdAt
      FROM rainfall_entries
      ORDER BY date DESC
    `);

    if (result.length === 0) {
      return [];
    }

    const columns = result[0].columns;
    const values = result[0].values;

    return values.map((row) => ({
      id: row[columns.indexOf('id')] as number,
      date: row[columns.indexOf('date')] as string,
      amount: row[columns.indexOf('amount')] as number,
      createdAt: row[columns.indexOf('createdAt')] as string,
    }));
  }

  async findByDate(date: string): Promise<RainfallEntry | null> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec(
      `SELECT id, date, amount, created_at as createdAt FROM rainfall_entries WHERE date = ?`,
      [date]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const columns = result[0].columns;
    const row = result[0].values[0];

    return {
      id: row[columns.indexOf('id')] as number,
      date: row[columns.indexOf('date')] as string,
      amount: row[columns.indexOf('amount')] as number,
      createdAt: row[columns.indexOf('createdAt')] as string,
    };
  }

  async findByDateRange(
    startDate: string,
    endDate: string
  ): Promise<RainfallEntry[]> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec(
      `SELECT id, date, amount, created_at as createdAt
       FROM rainfall_entries
       WHERE date >= ? AND date <= ?
       ORDER BY date DESC`,
      [startDate, endDate]
    );

    if (result.length === 0) {
      return [];
    }

    const columns = result[0].columns;
    const values = result[0].values;

    return values.map((row) => ({
      id: row[columns.indexOf('id')] as number,
      date: row[columns.indexOf('date')] as string,
      amount: row[columns.indexOf('amount')] as number,
      createdAt: row[columns.indexOf('createdAt')] as string,
    }));
  }
}
