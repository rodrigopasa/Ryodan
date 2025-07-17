#!/bin/bash

# Script de inicialização para deploy no Coolify
set -e

echo "🚀 Iniciando configuração para deploy no Coolify..."

# Criar diretórios necessários
echo "📁 Criando diretórios necessários..."
mkdir -p uploads/pdfs uploads/thumbnails uploads/avatars uploads/temp

# Verificar variáveis de ambiente obrigatórias
echo "🔍 Verificando variáveis de ambiente..."
required_vars=("DATABASE_URL" "PGHOST" "PGPORT" "PGUSER" "PGPASSWORD" "PGDATABASE")

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Variável de ambiente $var não está definida"
        exit 1
    fi
done

echo "✅ Todas as variáveis de ambiente estão definidas"

# Instalar dependências de produção
echo "📦 Instalando dependências..."
npm ci --only=production

# Executar build
echo "🏗️ Executando build..."
npm run build

# Executar push do schema do banco
echo "🗄️ Configurando banco de dados..."
npm run db:push

echo "✅ Configuração de deploy concluída com sucesso!"