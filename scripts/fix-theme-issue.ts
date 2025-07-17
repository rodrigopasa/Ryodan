#!/usr/bin/env tsx
/**
 * Script para resolver problemas de tema que podem afetar o deploy
 */

import { existsSync, writeFileSync, unlinkSync } from 'fs';
import { readFileSync } from 'fs';

function removeProblematicThemeFile() {
  console.log('🔧 Removendo arquivo de tema problemático...');
  
  const themeFile = 'theme.json';
  
  if (existsSync(themeFile)) {
    try {
      unlinkSync(themeFile);
      console.log('✅ Arquivo theme.json removido com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover theme.json:', error);
    }
  } else {
    console.log('ℹ️ Arquivo theme.json não encontrado');
  }
}

function ensureCSSStyling() {
  console.log('🎨 Verificando estilos CSS...');
  
  const cssFile = 'client/src/index.css';
  
  if (!existsSync(cssFile)) {
    console.error('❌ Arquivo CSS não encontrado');
    return false;
  }
  
  const cssContent = readFileSync(cssFile, 'utf8');
  
  // Verificar se tem as variáveis CSS necessárias
  const requiredVariables = [
    '--background',
    '--foreground',
    '--primary',
    '--secondary'
  ];
  
  let hasAllVariables = true;
  
  for (const variable of requiredVariables) {
    if (!cssContent.includes(variable)) {
      console.error(`❌ Variável CSS ${variable} não encontrada`);
      hasAllVariables = false;
    }
  }
  
  if (hasAllVariables) {
    console.log('✅ Todas as variáveis CSS necessárias estão presentes');
    return true;
  }
  
  return false;
}

function createBuildReadyEnvironment() {
  console.log('🏗️ Criando ambiente pronto para build...');
  
  // Criar diretórios necessários
  const dirs = [
    'uploads',
    'uploads/pdfs',
    'uploads/thumbnails',
    'uploads/avatars',
    'uploads/temp'
  ];
  
  dirs.forEach(dir => {
    if (!existsSync(dir)) {
      const fs = require('fs');
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Diretório ${dir} criado`);
    }
  });
  
  // Criar arquivo .gitkeep para manter estrutura
  dirs.forEach(dir => {
    const gitkeepFile = `${dir}/.gitkeep`;
    if (!existsSync(gitkeepFile)) {
      writeFileSync(gitkeepFile, '');
    }
  });
  
  console.log('✅ Ambiente pronto para build');
}

function fixThemeIssues() {
  console.log('🔧 Corrigindo problemas de tema para deploy...\n');
  
  try {
    removeProblematicThemeFile();
    ensureCSSStyling();
    createBuildReadyEnvironment();
    
    console.log('\n✅ Correções aplicadas com sucesso!');
    console.log('🚀 Sistema pronto para deploy no Coolify');
    
    return true;
  } catch (error) {
    console.error('\n❌ Erro ao aplicar correções:', error);
    return false;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = fixThemeIssues();
  process.exit(success ? 0 : 1);
}

export { fixThemeIssues };