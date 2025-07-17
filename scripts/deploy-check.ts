#!/usr/bin/env tsx
/**
 * Script de verificação pré-deploy para garantir que o sistema está pronto
 */

import { pool } from '../server/db.js';
import { createAdminUser, createDefaultCategories } from '../server/migrate.js';
import * as fs from 'fs';
import * as path from 'path';

async function checkEnvironment() {
  console.log('🔍 Verificando variáveis de ambiente...');
  
  const requiredEnvVars = ['DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias ausentes:', missingVars);
    return false;
  }
  
  console.log('✅ Variáveis de ambiente configuradas');
  return true;
}

async function checkDatabase() {
  console.log('🔍 Verificando conexão com banco de dados...');
  
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Conexão com banco de dados estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error);
    return false;
  }
}

async function checkDirectories() {
  console.log('🔍 Verificando diretórios necessários...');
  
  const requiredDirs = [
    'uploads',
    'uploads/pdfs',
    'uploads/thumbnails',
    'uploads/avatars'
  ];
  
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      console.log(`📁 Criando diretório: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  
  console.log('✅ Diretórios verificados/criados');
  return true;
}

async function initializeData() {
  console.log('🔍 Inicializando dados padrão...');
  
  try {
    await createAdminUser();
    await createDefaultCategories();
    console.log('✅ Dados padrão inicializados');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar dados:', error);
    return false;
  }
}

async function checkDependencies() {
  console.log('🔍 Verificando dependências críticas...');
  
  try {
    // Verificar se os módulos críticos podem ser importados
    await import('@shared/schema');
    await import('../server/routes.js');
    await import('../server/db-storage.js');
    
    console.log('✅ Dependências críticas verificadas');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar dependências:', error);
    return false;
  }
}

async function runDeployCheck() {
  console.log('🚀 Iniciando verificação de deploy...\n');
  
  const checks = [
    { name: 'Ambiente', fn: checkEnvironment },
    { name: 'Banco de dados', fn: checkDatabase },
    { name: 'Diretórios', fn: checkDirectories },
    { name: 'Dependências', fn: checkDependencies },
    { name: 'Dados padrão', fn: initializeData },
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    try {
      const result = await check.fn();
      if (!result) {
        allPassed = false;
      }
    } catch (error) {
      console.error(`❌ Erro na verificação ${check.name}:`, error);
      allPassed = false;
    }
    console.log('');
  }
  
  if (allPassed) {
    console.log('🎉 Todas as verificações passaram! Sistema pronto para deploy.');
    process.exit(0);
  } else {
    console.log('⚠️  Algumas verificações falharam. Corrija os problemas antes do deploy.');
    process.exit(1);
  }
}

// Executar verificação
runDeployCheck().catch((error) => {
  console.error('💥 Erro crítico na verificação de deploy:', error);
  process.exit(1);
});