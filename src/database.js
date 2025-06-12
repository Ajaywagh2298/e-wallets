import { initializeTables } from './tables.js';
import { runMigrations } from './migrations.js';
import { initConfigService, initCustomForms } from './configService.js';
import { saveLogs } from './controller.js'
import { BankList } from './BankList.js';

const initdbServer = async () => {
   // console.log('🚀 Initializing database server...');

  try {

     // console.log('🧱 Database server initialized Processes Starting. ');

    initializeTables();

    await BankList();

    await initConfigService();

    await runMigrations();

    await initCustomForms();

     // console.log('🎉 Database server initialized successfully');
  } catch (error) {
     // console.error('❌ Error initializing DB server:', error);
    await saveLogs?.(error); // Save to DB if error logging is available
  }
};

export default initdbServer;
