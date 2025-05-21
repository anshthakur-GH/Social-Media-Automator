import { pool } from './config';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .filter(statement => statement.trim().length > 0);

    const connection = await pool.getConnection();
    
    console.log('Starting database initialization...');

    try {
      // Execute each statement
      for (const statement of statements) {
        await connection.query(statement);
        console.log('Executed statement successfully');
      }

      console.log('Database initialization completed successfully');
    } catch (error) {
      console.error('Error executing schema:', error);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase }; 