#!/bin/bash

# Script completo para deploy no Coolify
set -e

echo "🚀 Iniciando deploy no Coolify..."
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

log_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

# Verificar se estamos em ambiente de produção
if [ "$NODE_ENV" != "production" ]; then
    log_warning "NODE_ENV não está definido como 'production'"
    export NODE_ENV=production
fi

# Verificar variáveis de ambiente obrigatórias
log_info "Verificando variáveis de ambiente..."
required_vars=("DATABASE_URL" "PGHOST" "PGPORT" "PGUSER" "PGPASSWORD" "PGDATABASE")

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        log_error "Variável de ambiente $var não está definida"
        exit 1
    fi
done

log_success "Todas as variáveis de ambiente necessárias estão definidas"

# Corrigir problemas de tema
log_info "Corrigindo problemas de tema..."
if [ -f "theme.json" ]; then
    rm -f theme.json
    log_success "Arquivo theme.json problemático removido"
fi

# Criar diretórios necessários
log_info "Criando diretórios necessários..."
mkdir -p uploads/pdfs uploads/thumbnails uploads/avatars uploads/temp

# Definir permissões corretas
chmod 755 uploads
chmod 755 uploads/pdfs uploads/thumbnails uploads/avatars uploads/temp

log_success "Diretórios criados com permissões corretas"

# Limpar cache do npm
log_info "Limpando cache do npm..."
npm cache clean --force

# Instalar dependências
log_info "Instalando dependências..."
npm ci --only=production

# Executar build
log_info "Executando build da aplicação..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    log_error "Build falhou - diretório 'dist' não encontrado"
    exit 1
fi

log_success "Build concluído com sucesso"

# Configurar banco de dados
log_info "Configurando banco de dados..."
npm run db:push

# Verificar se o servidor pode iniciar
log_info "Verificando inicialização do servidor..."
timeout 30 npm start &
server_pid=$!

# Aguardar alguns segundos para o servidor iniciar
sleep 10

# Verificar se o processo ainda está rodando
if kill -0 $server_pid 2>/dev/null; then
    log_success "Servidor iniciou com sucesso"
    kill $server_pid
else
    log_error "Servidor falhou ao iniciar"
    exit 1
fi

# Limpar processos
pkill -f "npm start" || true

log_success "Deploy preparado com sucesso!"
echo "=========================================="
echo "🎉 Sistema pronto para deploy no Coolify"
echo ""
echo "Próximos passos:"
echo "1. Configure as variáveis de ambiente no Coolify"
echo "2. Configure o domínio e SSL"
echo "3. Faça o deploy da aplicação"
echo "4. Verifique o health check: /api/health"
echo "5. Monitore os logs por alguns minutos"
echo ""
echo "Para troubleshooting, consulte: deployment-guide.md"