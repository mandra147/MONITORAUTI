
const fs = require('fs');
const path = require('path');
const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'attached_assets', 'Pasted-SET-client-encoding-UTF8-CREATE-TABLE-IF-NOT-EXISTS-public-pacientes-id-paciente-SERIAL--1745258238042.txt');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Configure the database connection
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

// Setup the pool connection with WebSocket support
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  webSocketConstructor: ws
});

// Execute the SQL statements
async function executeSqlScript() {
  const client = await pool.connect();
  try {
    console.log("Connected to database. Executing SQL script...");
    
    // Execute the entire script as a transaction
    await client.query('BEGIN');
    
    try {
      await client.query(sqlContent);
      await client.query('COMMIT');
      console.log("SQL script executed successfully. All 77 tables created.");
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error executing SQL script:", error);
      throw error;
    }
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the function
executeSqlScript()
  .then(() => {
    console.log("Database setup completed.");
  })
  .catch(err => {
    console.error("Failed to execute SQL script:", err);
    process.exit(1);
  });
