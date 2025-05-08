import * as SQLite from 'expo-sqlite';

let database = SQLite.openDatabaseSync('crypts.db');

const ENCRYPT_KEY = 'lakshcrypt@2298';
const SECURE_FILE_EXT = 'cryptVault';

export { database, ENCRYPT_KEY, SECURE_FILE_EXT };
