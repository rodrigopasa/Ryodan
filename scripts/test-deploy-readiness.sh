#!/bin/bash

# Script para testar se o sistema está pronto para deploy no Coolify
set -e

echo "🧪 Testando prontidão para deploy..."
echo "=========================================="

# Função para log colorido
log_info() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

log_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

# Testar build
log_info "Testando build da aplicação..."
npm run build

if [ ! -d "dist" ]; then
    log_error "Build falhou - diretório 'dist' não encontrado"
    exit 1
fi

log_success "Build passou no teste"

# Testar se o servidor pode iniciar
log_info "Testando inicialização do servidor..."
timeout 15 npm start &
server_pid=$!

# Aguardar servidor iniciar
sleep 10

# Testar health check
log_info "Testando health check..."
health_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "000")

if [ "$health_response" = "200" ]; then
    log_success "Health check passou no teste"
else
    log_error "Health check falhou (HTTP $health_response)"
    kill $server_pid || true
    exit 1
fi

# Testar página inicial
log_info "Testando página inicial..."
home_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000 || echo "000")

if [ "$home_response" = "200" ]; then
    log_success "Página inicial passou no teste"
else
    log_error "Página inicial falhou (HTTP $home_response)"
    kill $server_pid || true
    exit 1
fi

# Limpar processos
kill $server_pid || true
pkill -f "npm start" || true

# Verificar estrutura de diretórios
log_info "Verificando estrutura de diretórios..."
required_dirs=("uploads" "uploads/pdfs" "uploads/thumbnails" "uploads/avatars" "uploads/temp")

for dir in "${required_dirs[@]}"; do
    if [ ! -d "$dir" ]; then
        log_error "Diretório $dir não encontrado"
        exit 1
    fi
done

log_success "Estrutura de diretórios OK"

# Verificar arquivos de configuração
log_info "Verificando arquivos de configuração..."
config_files=("Dockerfile" "docker-compose.yml" "coolify-config.json" "deployment-guide.md")

for file in "${config_files[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "Arquivo de configuração $file não encontrado"
        exit 1
    fi
done

log_success "Arquivos de configuração OK"

# Verificar se theme.json problemático foi removido
log_info "Verificando se problemas de tema foram corrigidos..."
if [ -f "theme.json" ]; then
    log_error "Arquivo theme.json ainda existe - pode causar problemas no deploy"
    exit 1
fi

log_success "Problemas de tema corrigidos"

echo "=========================================="
log_success "Sistema está pronto para deploy no Coolify!"
echo ""
echo "Arquivos criados para deploy:"
echo "- Dockerfile (container de produção)"
echo "- docker-compose.yml (orquestração)"
echo "- coolify-config.json (configuração do Coolify)"
echo "- deployment-guide.md (guia completo)"
echo "- scripts/coolify-deploy.sh (script de deploy)"
echo "- scripts/fix-theme-issue.ts (correção de temas)"
echo ""
echo "Para deploy no Coolify:"
echo "1. Leia o deployment-guide.md"
echo "2. Configure as variáveis de ambiente"
echo "3. Execute o deploy"
echo "4. Monitore os logs"