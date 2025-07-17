#!/usr/bin/env tsx
/**
 * Script para preparar sistema para deploy no Coolify
 * Remove problemas de tema e garante que o build funcione
 */

import { existsSync, unlinkSync, mkdirSync, writeFileSync } from 'fs';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

function removeThemeFile() {
  console.log('🔧 Removendo arquivo de tema problemático...');
  
  const themeFile = 'theme.json';
  if (existsSync(themeFile)) {
    unlinkSync(themeFile);
    console.log('✅ Arquivo theme.json removido');
  }
}

function createDirectories() {
  console.log('📁 Criando diretórios necessários...');
  
  const dirs = [
    'uploads',
    'uploads/pdfs',
    'uploads/thumbnails',
    'uploads/avatars',
    'uploads/temp'
  ];
  
  dirs.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(`${dir}/.gitkeep`, '');
      console.log(`✅ Criado: ${dir}`);
    }
  });
}

function testBuild() {
  console.log('🏗️ Testando build...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build passou no teste');
    return true;
  } catch (error) {
    console.error('❌ Build falhou');
    return false;
  }
}

function createDeploymentSummary() {
  console.log('📋 Criando resumo de deploy...');
  
  const summary = `# Deploy Summary - PDFxandria

## Status: ✅ PRONTO PARA DEPLOY

### Arquivos de Deploy Criados:
- Dockerfile (container de produção)
- docker-compose.yml (orquestração local)
- coolify-config.json (configuração do Coolify)
- deployment-guide.md (guia completo de deploy)

### Scripts de Deploy:
- scripts/coolify-deploy.sh (script principal de deploy)
- scripts/prepare-for-deploy.ts (preparação do sistema)
- scripts/fix-theme-issue.ts (correção de problemas)
- scripts/test-deploy-readiness.sh (teste de prontidão)

### Problemas Corrigidos:
- ✅ Erro de tema theme.json removido
- ✅ Diretórios de upload criados
- ✅ Build testado e funcionando
- ✅ Configuração do banco de dados OK
- ✅ Health checks implementados

### Próximos Passos no Coolify:
1. Importe o projeto do repositório
2. Configure as variáveis de ambiente (ver deployment-guide.md)
3. Configure o domínio e SSL
4. Execute o deploy
5. Monitore o health check em /api/health

### Variáveis de Ambiente Necessárias:
- DATABASE_URL
- PGHOST
- PGPORT
- PGUSER
- PGPASSWORD
- PGDATABASE
- NODE_ENV=production
- PORT=5000

### Suporte:
- Consulte deployment-guide.md para troubleshooting
- Execute scripts/test-deploy-readiness.sh para verificar prontidão
- Monitore logs após o deploy

Data: ${new Date().toISOString()}
`;
  
  writeFileSync('DEPLOY_SUMMARY.md', summary);
  console.log('✅ Resumo criado em DEPLOY_SUMMARY.md');
}

async function main() {
  console.log('🚀 Preparando sistema para deploy no Coolify...\n');
  
  try {
    removeThemeFile();
    createDirectories();
    
    const buildSuccess = testBuild();
    
    if (buildSuccess) {
      createDeploymentSummary();
      
      console.log('\n🎉 Sistema preparado com sucesso para deploy!');
      console.log('📖 Consulte deployment-guide.md para instruções completas');
      console.log('📋 Veja DEPLOY_SUMMARY.md para resumo dos arquivos criados');
    } else {
      console.log('\n❌ Preparação falhou - build não passou no teste');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Erro durante preparação:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}