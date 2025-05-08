import { database } from '../config/config';

const tables = {
    migrations: `
        uid INTEGER PRIMARY KEY,
        version INTEGER NOT NULL,
        migrated_at DATE DEFAULT (datetime('now'))
    `,
    user : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        pin TEXT, 
        bioMetric TEXT,
        advancedSecurity TEXT,
        created_at DATE DEFAULT (datetime('now')),`,
    config : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT, 
        table_key TEXT,
        mainHeader TEXT, -- Storing JSON as TEXT
        showDataHeader TEXT, -- Storing JSON as TEXT
        isShare INTEGER DEFAULT 0,
        isVisible INTEGER DEFAULT 1,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    custom_form : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        form_inputs TEXT, -- Storing JSON as TEXT
        active INTEGER DEFAULT 1,
        isReminder INTEGER DEFAULT 0,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    bank_account : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT, 
        accountNumber TEXT, 
        accountHolderName TEXT, 
        accountType TEXT,
        bankName TEXT,
        branch TEXT,
        branchAddress TEXT,
        city TEXT,
        ifscCode TEXT,
        cifCode TEXT,
        micrCode TEXT,
        mobileNumber TEXT,
        nomineeName TEXT,
        upiId TEXT,
        notes TEXT,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now')),
        `,
    card_details : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        bankName TEXT, 
        cardNumber TEXT, 
        cvv TEXT, 
        validDate TEXT, 
        cardHolderName TEXT, 
        pin TEXT, 
        cardType TEXT,
        cardUserType TEXT,
        billingAddress TEXT,
        cardLimit TEXT,
        notes TEXT,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    net_banking : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        bankName TEXT, 
        accountType TEXT,
        userName TEXT, 
        password TEXT, 
        transactionPin TEXT,
        customerId TEXT,
        securityQuestion TEXT, 
        mobileNumber TEXT,
        upiId TEXT,
        notes TEXT,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    demat : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        brokerName TEXT,
        dematAccountNumber TEXT,
        despositoryName TEXT,
        tradingAccountNumber TEXT,
        clientId TEXT,
        email TEXT,
        mobileNumber TEXT,
        accountOpeningDate TEXT,
        linkedBankAccount TEXT,
        nomineeName TEXT,
        tradingPin TEXT,
        notes TEXT,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    secure_notes : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        category TEXT,
        locked INTEGER DEFAULT 0,
        notes TEXT,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    expense_details : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        transactionId TEXT,
        date DATE,
        category TEXT,
        amount INT,
        paymentMethod TEXT,
        monthlyLimit INT,
        notes TEXT,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    emergency_contact : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        relation TEXT,
        bloodGroup TEXT,
        allergies TEXT,
        medicalConditions TEXT,
        currentMedication TEXT,
        doctorDetails TEXT,
        insuranceDetails TEXT,
        policyNumber TEXT,
        emergencyPlan TEXT,
        notes TEXT,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    app_accounts : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        appName TEXT,
        username TEXT,
        password TEXT,
        loginMethod TEXT,
        faEnabled INTEGER DEFAULT 0,
        securityQuestion TEXT,
        phone TEXT,
        notes TEXT,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    task : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        taskName TEXT,
        description TEXT,
        category TEXT,
        priority TEXT,
        dueDate DATE,
        status TEXT,
        reminder INTEGER DEFAULT 0,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    email_details : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        companyType TEXT,
        email TEXT,
        password TEXT,
        accountHolderName TEXT,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    secure_file_locker : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        fileName TEXT,
        file_type TEXT,
        file_size TEXT,
        high_security INTEGER DEFAULT 0,
        accesslock INTEGER DEFAULT 0,
        autodelete INTEGER DEFAULT 0,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    custom_form_data : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT, 
        details TEXT,
        isReminder INTEGER DEFAULT 0,
        custom_form_uid INTEGER,
        created_at DATE DEFAULT (datetime('now')),
        updated_at DATE DEFAULT (datetime('now'))`,
    error_log : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        log_date DATE DEFAULT (datetime('now')),
        log_message TEXT`,
    banks : `
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        bank_name TEXT,
        bank_code TEXT,`,
};

export const initializeTables = () => {
    try {
      for (const [table, rawSchema] of Object.entries(tables)) {
        // Clean up trailing comma if exists
        const cleanedSchema = rawSchema.trim().replace(/,\s*$/, '');
        const sql = `CREATE TABLE IF NOT EXISTS ${table} (${cleanedSchema});`;
  
        // Execute synchronously
        database.runSync(
          sql,
          [],
          () => {
            console.log(`✅ Table ${table} created successfully`);
          },
          (error) => {
            console.error(`❌ Error creating table ${table}:`, error);
          }
        );
      }
    } catch (error) {
      console.error('❌ Error initializing tables:', error);
    }
  };
  