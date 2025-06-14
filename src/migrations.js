import { database }from '../config/config';
import { saveLogs } from './controller';

const migrations = [
  {
    version: 1,
    check: async () => {
      const result = await database.getAllAsync(
        `SELECT name FROM pragma_table_info('task') WHERE name = 'reminderTime';`
      );
      return result.length === 0;
    },
    query: `ALTER TABLE task ADD COLUMN reminderTime DATE;`,
  },
  {
    version: 2,
    check: async () => {
      const result = await database.getAllAsync(
        `SELECT name FROM pragma_table_info('task') WHERE name = 'reminderTime';`
      );
      return result.length === 0;
    },
    query: `ALTER TABLE task ADD COLUMN reminderTime DATE;`,
  }
];

export const runMigrations = async () => {
  try {
    const currentVersion = await getCurrentVersion();

    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        const shouldRun = typeof migration.check === 'function'
          ? await migration.check()
          : true;

        if (shouldRun) {
          await runQuery(migration.query);
          await setCurrentVersion(migration.version);
          console.log(`✅ Applied migration version ${migration.version}`);
        } else {
          console.log(`⚠️ Skipped migration version ${migration.version} (already applied)`);
        }
      }
    }
  } catch (err) {
    await saveLogs(`Migration Error: ${err.message || err}`);
    console.error(`❌ Migration Error:`, err);
  }
};

  const getCurrentVersion = async () => {
    try {
      const rows = await database.getAllAsync(
        `SELECT MAX(version) as version FROM migrations`
      );
      return rows?.[0]?.version || 0;
    } catch (error) {
      if (error.message?.includes('no such table')) {
        // If the migrations table doesn't exist yet
        return 0;
      }
      await saveLogs(`getCurrentVersion Error: ${error.message || error}`);
       // console.error(`❌ getCurrentVersion Error:`, error);
      return 0;
    }
  };
  
  const setCurrentVersion = async (version) => {
    try {
      await database.runAsync(
        `INSERT INTO migrations (version) VALUES (?)`,
        [version]
      );
    } catch (error) {
      await saveLogs(`setCurrentVersion Error: ${error.message || error}`);
      throw error;
    }
  };
  
  const runQuery = async (query) => {
    try {
      await database.runAsync(query);
    } catch (error) {
      await saveLogs(`Migration query failed: ${query} - ${error.message || error}`);
      throw new Error(`Query failed: ${query} \nError: ${error.message || error}`);
    }
  };