#!/bin/bash

# Script de verificação de saúde para Coolify
set -e

# Verificar se o servidor está respondendo
echo "🔍 Verificando saúde do servidor..."

# Aguardar servidor iniciar
sleep 5

# Verificar endpoint de saúde
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "000")

if [ "$response" = "200" ]; then
    echo "✅ Servidor está saudável"
    exit 0
else
    echo "❌ Servidor não está respondendo adequadamente (HTTP $response)"
    exit 1
fi