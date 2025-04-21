// Script para criação das tabelas do MonitoraUTI
import fs from 'fs';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ws from 'ws';

// Configurando o WebSocket para o Neon Database
neonConfig.webSocketConstructor = ws;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function executeSqlScript() {
  try {
    // Ler o script SQL a partir do arquivo
    const sqlScript = fs.readFileSync('./attached_assets/Pasted-SET-client-encoding-UTF8-CREATE-TABLE-IF-NOT-EXISTS-public-pacientes-id-paciente-SERIAL--1745258530160.txt', 'utf8');
    
    console.log('Executando script SQL para criar todas as tabelas do MonitoraUTI...');
    
    // Executar o script SQL
    await pool.query(sqlScript);
    
    console.log('Tabelas criadas com sucesso!');
    
    // Verificar algumas das tabelas principais
    const { rows } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('Tabelas criadas:');
    rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('Erro ao executar o script SQL:', error.message);
    if (error.position) {
      console.error(`Erro próximo à posição: ${error.position}`);
      // Mostrar trecho do SQL com erro
      const sqlScript = fs.readFileSync('./attached_assets/Pasted-SET-client-encoding-UTF8-CREATE-TABLE-IF-NOT-EXISTS-public-pacientes-id-paciente-SERIAL--1745258530160.txt', 'utf8');
      const errorPos = parseInt(error.position);
      const start = Math.max(0, errorPos - 100);
      const end = Math.min(sqlScript.length, errorPos + 100);
      console.error('Trecho do SQL com erro:');
      console.error(sqlScript.substring(start, end));
    }
  } finally {
    // Fechar a conexão com o banco de dados
    await pool.end();
  }
}

// Executar a função principal
executeSqlScript();