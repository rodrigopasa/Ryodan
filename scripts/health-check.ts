#!/usr/bin/env tsx
/**
 * Script de verificação de saúde do sistema
 */

import { pool } from '../server/db.js';
import * as fs from 'fs';

async function checkDatabaseHealth() {
  try {
    const client = await pool.connect();
    
    // Verificar se tabelas principais existem
    const tables = ['users', 'categories', 'pdfs', 'seo_settings'];
    for (const table of tables) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        );
      `, [table]);
      
      if (!result.rows[0].exists) {
        throw new Error(`Tabela '${table}' não encontrada`);
      }
    }
    
    // Verificar se usuário admin existe
    const adminCheck = await client.query(`
      SELECT COUNT(*) FROM users WHERE is_admin = true
    `);
    
    if (parseInt(adminCheck.rows[0].count) === 0) {
      throw new Error('Nenhum usuário admin encontrado');
    }
    
    client.release();
    return { status: 'healthy', message: 'Banco de dados operacional' };
  } catch (error) {
    return { status: 'unhealthy', message: `Erro no banco: ${error.message}` };
  }
}

async function checkFileSystem() {
  try {
    const requiredDirs = ['uploads', 'uploads/pdfs', 'uploads/thumbnails'];
    
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        throw new Error(`Diretório '${dir}' não encontrado`);
      }
    }
    
    return { status: 'healthy', message: 'Sistema de arquivos operacional' };
  } catch (error) {
    return { status: 'unhealthy', message: `Erro no sistema de arquivos: ${error.message}` };
  }
}

async function runHealthCheck() {
  const checks = [
    { name: 'Database', fn: checkDatabaseHealth },
    { name: 'FileSystem', fn: checkFileSystem },
  ];
  
  const results = {};
  let overallHealth = 'healthy';
  
  for (const check of checks) {
    try {
      results[check.name] = await check.fn();
      if (results[check.name].status === 'unhealthy') {
        overallHealth = 'unhealthy';
      }
    } catch (error) {
      results[check.name] = { status: 'unhealthy', message: error.message };
      overallHealth = 'unhealthy';
    }
  }
  
  const healthReport = {
    status: overallHealth,
    timestamp: new Date().toISOString(),
    checks: results
  };
  
  console.log(JSON.stringify(healthReport, null, 2));
  
  if (overallHealth === 'unhealthy') {
    process.exit(1);
  }
}

runHealthCheck().catch(error => {
  console.error(JSON.stringify({
    status: 'unhealthy',
    timestamp: new Date().toISOString(),
    error: error.message
  }, null, 2));
  process.exit(1);
});