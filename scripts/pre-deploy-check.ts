#!/usr/bin/env tsx
/**
 * Script de verificação pré-deploy para prevenir falhas comuns
 */

import { db } from '../server/db';
import { existsSync, mkdirSync } from 'fs';
import { readFileSync } from 'fs';
import path from 'path';

async function checkDatabaseConnection() {
  console.log('🔍 Verificando conexão com banco de dados...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não está definido');
    return false;
  }

  try {
    // Testa a conexão com uma query simples
    await db.execute('SELECT 1');
    console.log('✅ Conexão com banco de dados OK');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com banco de dados:', error);
    return false;
  }
}

async function checkRequiredDirectories() {
  console.log('🔍 Verificando diretórios necessários...');
  
  const requiredDirs = [
    'uploads',
    'uploads/pdfs',
    'uploads/thumbnails',
    'uploads/avatars',
    'uploads/temp'
  ];

  let allDirsOk = true;
  
  for (const dir of requiredDirs) {
    if (!existsSync(dir)) {
      console.log(`📁 Criando diretório: ${dir}`);
      mkdirSync(dir, { recursive: true });
    }
  }
  
  console.log('✅ Diretórios necessários OK');
  return allDirsOk;
}

async function checkThemeConfiguration() {
  console.log('🔍 Verificando configuração do tema...');
  
  try {
    const themeFile = 'theme.json';
    if (!existsSync(themeFile)) {
      console.error('❌ theme.json não encontrado');
      return false;
    }
    
    const themeContent = readFileSync(themeFile, 'utf8');
    const theme = JSON.parse(themeContent);
    
    // Verifica se tem uma variante válida
    const validVariants = ['default', 'zinc', 'stone', 'gray', 'neutral', 'slate', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet'];
    
    if (!theme.variant || !validVariants.includes(theme.variant)) {
      console.error('❌ Variante do tema inválida:', theme.variant);
      console.log('Variantes válidas:', validVariants.join(', '));
      return false;
    }
    
    console.log('✅ Configuração do tema OK');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar configuração do tema:', error);
    return false;
  }
}

async function checkEnvironmentVariables() {
  console.log('🔍 Verificando variáveis de ambiente...');
  
  const requiredEnvVars = [
    'DATABASE_URL',
    'PGHOST',
    'PGPORT',
    'PGUSER',
    'PGPASSWORD',
    'PGDATABASE'
  ];
  
  let allEnvVarsOk = true;
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Variável de ambiente ${envVar} não definida`);
      allEnvVarsOk = false;
    }
  }
  
  if (allEnvVarsOk) {
    console.log('✅ Variáveis de ambiente OK');
  }
  
  return allEnvVarsOk;
}

async function checkDependencies() {
  console.log('🔍 Verificando dependências críticas...');
  
  try {
    // Verifica se o package.json existe
    const packageFile = 'package.json';
    if (!existsSync(packageFile)) {
      console.error('❌ package.json não encontrado');
      return false;
    }
    
    const packageContent = readFileSync(packageFile, 'utf8');
    const pkg = JSON.parse(packageContent);
    
    const criticalDeps = [
      'react',
      'express',
      'drizzle-orm',
      '@neondatabase/serverless',
      'pg'
    ];
    
    for (const dep of criticalDeps) {
      if (!pkg.dependencies[dep] && !pkg.devDependencies?.[dep]) {
        console.error(`❌ Dependência crítica ${dep} não encontrada`);
        return false;
      }
    }
    
    console.log('✅ Dependências críticas OK');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar dependências:', error);
    return false;
  }
}

async function runPreDeployCheck() {
  console.log('🚀 Iniciando verificação pré-deploy...\n');
  
  const checks = [
    checkEnvironmentVariables,
    checkDatabaseConnection,
    checkRequiredDirectories,
    checkThemeConfiguration,
    checkDependencies
  ];
  
  let allChecksPassed = true;
  
  for (const check of checks) {
    try {
      const result = await check();
      if (!result) {
        allChecksPassed = false;
      }
    } catch (error) {
      console.error(`❌ Erro durante verificação:`, error);
      allChecksPassed = false;
    }
    console.log(''); // Linha em branco para separar as verificações
  }
  
  if (allChecksPassed) {
    console.log('🎉 Todas as verificações passaram! Sistema pronto para deploy.');
    process.exit(0);
  } else {
    console.log('❌ Algumas verificações falharam. Corrija os problemas antes do deploy.');
    process.exit(1);
  }
}

// Executa as verificações se este script foi chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runPreDeployCheck();
}

export { runPreDeployCheck };