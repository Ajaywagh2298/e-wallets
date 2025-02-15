import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Open (or create) the database asynchronously
let db;

const initializeDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('wallet.db');
    console.log('✅ Database opened successfully');
  }
};

// ================== Email Table ==================
const createEmailTable = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Email (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        companyType TEXT, 
        accountHolderName TEXT, 
        emailId TEXT, 
        password TEXT
      );
    `);
    console.log('✅ Email Table created successfully');
  } catch (error) {
    console.error('❌ Error creating Email table:', error);
  }
};

const insertEmailData = async (companyType, accountHolderName, emailId, password) => {
  await initializeDatabase();
  try {
    await db.runAsync(
      `INSERT INTO Email (companyType, accountHolderName, emailId, password) VALUES (?, ?, ?, ?);`,
      [companyType, accountHolderName, emailId, password]
    );
    console.log('✅ Email Data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting Email data:', error);
  }
};

const getAllEmailData = async () => {
  await initializeDatabase();
  try {
    const results = await db.getAllAsync('SELECT * FROM Email;');
    console.log('✅ Retrieved Email data:', results);
    return results;
  } catch (error) {
    console.error('❌ Error fetching Email data:', error);
    return [];
  }
};

// ================== User Table ==================
const createUserTable = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT, 
        pin TEXT, 
        bioMetric TEXT
      );
    `);
    console.log('✅ User Table created successfully');
  } catch (error) {
    console.error('❌ Error creating User table:', error);
  }
};

const insertUserData = async (name, pin, bioMetric) => {
  await initializeDatabase();
  try {
    await db.runAsync(
      `INSERT INTO User (name, pin, bioMetric) VALUES (?, ?, ?);`,
      [name, pin, bioMetric]
    );
    console.log('✅ User Data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting User data:', error);
  }
};

const getAllUserData = async () => {
  await initializeDatabase();
  try {
    const results = await db.getAllAsync('SELECT * FROM User;');
    console.log('✅ Retrieved User data:', results);
    return results;
  } catch (error) {
    console.error('❌ Error fetching User data:', error);
    return [];
  }
};

const login = async (name, pin) => {
  await initializeDatabase();
  try {
    const results = await db.getAsync(
      `SELECT * FROM User WHERE name = ? AND pin = ?;`,
      [name, pin]
    );
    console.log('✅ Login Success:', results);
    return results;
  } catch (error) {
    console.error('❌ Error in login:', error);
    return null;
  }
};

// ================== NetBanking Table ==================
const createNetBankingTable = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS NetBanking (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        accountType TEXT, 
        bankName TEXT, 
        accountNumber TEXT, 
        userId TEXT, 
        password TEXT, 
        note TEXT
      );
    `);
    console.log('✅ NetBanking Table created successfully');
  } catch (error) {
    console.error('❌ Error creating NetBanking table:', error);
  }
};

const insertNetBankingData = async (accountType, bankName, accountNumber, userId, password, note) => {
  await initializeDatabase();
  try {
    await db.runAsync(
      `INSERT INTO NetBanking (accountType, bankName, accountNumber, userId, password, note) VALUES (?, ?, ?, ?, ?, ?);`,
      [accountType, bankName, accountNumber, userId, password, note]
    );
    console.log('✅ NetBanking Data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting NetBanking data:', error);
  }
};

const getAllNetBankingData = async () => {
  await initializeDatabase();
  try {
    const results = await db.getAllAsync('SELECT * FROM NetBanking;');
    console.log('✅ Retrieved NetBanking data:', results);
    return results;
  } catch (error) {
    console.error('❌ Error fetching NetBanking data:', error);
    return [];
  }
};

// ================== CardDetails Table ==================
const createCardDetailsTable = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS CardDetails (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        bankName TEXT, 
        cardNumber TEXT, 
        cvv TEXT, 
        validDate TEXT, 
        cardHolderName TEXT, 
        pin TEXT, 
        cardType TEXT
      );
    `);
    console.log('✅ CardDetails Table created successfully');
  } catch (error) {
    console.error('❌ Error creating CardDetails table:', error);
  }
};

const insertCardDetailsData = async (bankName, cardNumber, cvv, validDate, cardHolderName, pin, cardType) => {
  await initializeDatabase();
  try {
    await db.runAsync(
      `INSERT INTO CardDetails (bankName, cardNumber, cvv, validDate, cardHolderName, pin, cardType) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [bankName, cardNumber, cvv, validDate, cardHolderName, pin, cardType]
    );
    console.log('✅ CardDetails Data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting CardDetails data:', error);
  }
};

const getAllCardDetailsData = async () => {
  await initializeDatabase();
  try {
    const results = await db.getAllAsync('SELECT * FROM CardDetails;');
    console.log('✅ Retrieved CardDetails data:', results);
    return results;
  } catch (error) {
    console.error('❌ Error fetching CardDetails data:', error);
    return [];
  }
};

// ================== Demat Table ==================
const createDematTable = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Demat (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        dematId TEXT, 
        username TEXT, 
        password TEXT,
        note TEXT
      );
    `);
    console.log('✅ Demat Table created successfully');
  } catch (error) {
    console.error('❌ Error creating Demat table:', error);
  }
};

const insertDematData = async (dematId,  username, password) => {
  await initializeDatabase();
  try {
    await db.runAsync(
      `INSERT INTO Demat (dematId, username, password) VALUES (?, ?, ?);`,
      [dematId,  username, password ]
    );
    console.log('✅ Demat Data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting Demat data:', error);
  }
};

const getAllDematData = async () => {
  await initializeDatabase();
  try {
    const results = await db.getAllAsync('SELECT * FROM Demat;');
    console.log('✅ Retrieved Demat data:', results);
    return results;
  } catch (error) {
    console.error('❌ Error fetching Demat data:', error);
    return [];
  }
};

// ================== AppAccount Table ==================
const createAppAccountTable = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS AppAccount (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        appName TEXT, 
        username TEXT, 
        password TEXT, 
        securityQA TEXT
      );
    `);
    console.log('✅ AppAccount Table created successfully');
  } catch (error) {
    console.error('❌ Error creating AppAccount table:', error);
  }
};

const insertAppAccountData = async (appName, username, password, securityQA) => {
  await initializeDatabase();
  try {
    await db.runAsync(
      `INSERT INTO AppAccount (appName, username, password, securityQA) VALUES (?, ?, ?, ?);`,
      [appName, username, password, JSON.stringify(securityQA)]
    );
    console.log('✅ AppAccount Data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting AppAccount data:', error);
  }
};

const getAllAppAccountData = async () => {
  await initializeDatabase();
  try {
    const results = await db.getAllAsync('SELECT * FROM AppAccount;');
    console.log('✅ Retrieved AppAccount data:', results);
    return results;
  } catch (error) {
    console.error('❌ Error fetching AppAccount data:', error);
    return [];
  }
};

// ================== NotePad Table ==================
const createNotePadTable = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS NotePad (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT, 
        note TEXT
      );
    `);
    console.log('✅ NotePad Table created successfully');
  } catch (error) {
    console.error('❌ Error creating NotePad table:', error);
  }
};

const insertNotePadData = async (title, note) => {
  await initializeDatabase();
  try {
    await db.runAsync(
      `INSERT INTO NotePad (title, note) VALUES (?, ?);`,
      [title, note]
    );
    console.log('✅ NotePad Data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting NotePad data:', error);
  }
};

const getAllNotePadData = async () => {
  await initializeDatabase();
  try {
    const results = await db.getAllAsync('SELECT * FROM NotePad;');
    console.log('✅ Retrieved NotePad data:', results);
    return results;
  } catch (error) {
    console.error('❌ Error fetching NotePad data:', error);
    return [];
  }
};

// ================== Other Table ==================
const createOtherTable = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Other (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        type TEXT, 
        details TEXT
      );
    `);
    console.log('✅ Other Table created successfully');
  } catch (error) {
    console.error('❌ Error creating Other table:', error);
  }
};

const insertOtherData = async (type, details) => {
  await initializeDatabase();
  try {
    await db.runAsync(
      `INSERT INTO Other (type, details) VALUES (?, ?);`,
      [type, JSON.stringify(details)]
    );
    console.log('✅ Other Data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting Other data:', error);
  }
};

const getAllOtherData = async () => {
  await initializeDatabase();
  try {
    const results = await db.getAllAsync('SELECT * FROM Other;');
    console.log('✅ Retrieved Other data:', results);
    return results;
  } catch (error) {
    console.error('❌ Error fetching Other data:', error);
    return [];
  }
};

const createBankAccountTable = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS BankAccount (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        accountNumber TEXT, 
        accountHolderName TEXT, 
        bankName TEXT,
        branch TEXT,
        city TEXT,
        ifscCode TEXT,
        cifCode TEXT
      );
    `);
    console.log('✅ BankAccount table created successfully');
  } catch (error) {
    console.error('❌ Error creating BankAccount table:', error);
  }
};

const insertBankAccountData = async (accountNumber, accountHolderName, bankName, branch, city, ifscCode, cifCode) => {
  await initializeDatabase();
  try {
    await db.runAsync(
      `INSERT INTO BankAccount (accountNumber, accountHolderName, bankName, branch, city, ifscCode, cifCode) 
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [accountNumber, accountHolderName, bankName, branch, city, ifscCode, cifCode]
    );
    console.log('✅ Data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting data:', error);
  }
};

const getAllBankAccountData = async () => {
  await initializeDatabase();
  try {
    const results = await db.getAllAsync('SELECT * FROM BankAccount;');
    console.log('✅ Retrieved data:', results);
    return results;
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    return [];
  }
};

const createConfigTable = async () => {
  await initializeDatabase(); // Ensure DB is initialized first

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Config (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT, 
        mainHeader TEXT, -- Storing JSON as TEXT
        showDataHeader TEXT, -- Storing JSON as TEXT
        isShare INTEGER DEFAULT 0,
        isVisible INTEGER DEFAULT 1
      );
    `);
    console.log('✅ Config table created successfully');
  } catch (error) {
    console.error('❌ Error creating Config table:', error);
  }
};

const insertConfig = async (title, mainHeader, showDataHeader, isShare = 0, isVisible = 1) => {
  try {
    await db.runAsync(
      `INSERT INTO Config (title, mainHeader, showDataHeader, isShare, isVisible) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, JSON.stringify(mainHeader), JSON.stringify(showDataHeader), isShare, isVisible]
    );
    console.log('✅ Config inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting Config:', error);
  }
};

const updateConfig = async ( data) => {
  let { id, title, mainHeader, showDataHeader, isShare, isVisible } = data;
  try {
    await db.runAsync(
      `UPDATE Config 
       SET title = ?, mainHeader = ?, showDataHeader = ?, isShare = ?, isVisible = ?
       WHERE id = ?`,
      [title, JSON.stringify(mainHeader), JSON.stringify(showDataHeader), isShare, isVisible, id]
    );
    console.log(`✅ Config with ID ${id} updated successfully`);
  } catch (error) {
    console.error(`❌ Error updating Config with ID ${id}:`, error);
  }
};

const getAllConfig = async () => {
  try {
    const rows = await db.getAllAsync(`SELECT * FROM Config`);
    return rows.map(row => ({
      ...row,
      mainHeader: JSON.parse(row.mainHeader),
      showDataHeader: JSON.parse(row.showDataHeader)
    }));
  } catch (error) {
    console.error('❌ Error fetching Config:', error);
    return [];
  }
};

const getFilteredConfig = async (filterColumn, filterValue) => {
  try {
    const rows = await db.getAllAsync(`SELECT * FROM Config WHERE ${filterColumn} = ?`, [filterValue]);
    return rows.map(row => ({
      ...row,
      mainHeader: JSON.parse(row.mainHeader),
      showDataHeader: JSON.parse(row.showDataHeader),
    }));
  } catch (error) {
    console.error(`❌ Error fetching Config with filter ${filterColumn} = ${filterValue}:`, error);
    return [];
  }
};

const exportDatabase = async () => {
  try {
    const dbPath = FileSystem.documentDirectory + 'SQLite/wallet.db';
    const exportPath = FileSystem.documentDirectory + 'wallet_backup.db';

    // Copy database file to export path
    await FileSystem.copyAsync({ from: dbPath, to: exportPath });

    // Share the exported database file
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(exportPath);
      console.log('✅ Database exported successfully');
    } else {
      console.error('❌ Sharing is not available on this device');
    }
  } catch (error) {
    console.error('❌ Error exporting database:', error);
  }
};

// Function to import the database
const importDatabase = async (fileUri) => {
  try {
    const dbPath = FileSystem.documentDirectory + 'SQLite/wallet.db';

    // Copy the selected file to the app's database path
    await FileSystem.copyAsync({ from: fileUri, to: dbPath });

    console.log('✅ Database imported successfully. Restart the app for changes to take effect.');
  } catch (error) {
    console.error('❌ Error importing database:', error);
  }
};

// Export all functions
export {
  createEmailTable, insertEmailData, getAllEmailData,
  createUserTable, insertUserData, getAllUserData, login,
  createNetBankingTable, insertNetBankingData, getAllNetBankingData,
  createCardDetailsTable, insertCardDetailsData, getAllCardDetailsData,
  createDematTable, insertDematData, getAllDematData,
  createAppAccountTable, insertAppAccountData, getAllAppAccountData,
  createNotePadTable, insertNotePadData, getAllNotePadData,
  createOtherTable, insertOtherData, getAllOtherData,
  createBankAccountTable, insertBankAccountData, getAllBankAccountData,
  createConfigTable, insertConfig, updateConfig, getAllConfig, getFilteredConfig, importDatabase, exportDatabase
};