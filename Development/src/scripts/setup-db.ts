import { testConnection } from '../db/config';
import { initializeDatabase } from '../db/init-db';

async function setup() {
  try {
    // Test the connection first
    await testConnection();
    console.log('Connection test successful');

    // Initialize the database
    await initializeDatabase();
    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setup(); 