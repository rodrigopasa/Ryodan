# Dockerfile otimizado para produção
FROM node:20-alpine AS base

# Instalar dependências básicas
RUN apk add --no-cache curl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY drizzle.config.ts ./

# Instalar todas as dependências para build
RUN npm ci --verbose

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Instalar apenas dependências de produção
RUN rm -rf node_modules
RUN npm ci --only=production --ignore-scripts

# Criar diretórios necessários
RUN mkdir -p uploads/pdfs uploads/thumbnails uploads/avatars uploads/temp

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Definir permissões
RUN chown -R nextjs:nodejs uploads dist

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 5000

# Health check removido - causa problemas no Coolify
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:5000/api/health || exit 1

# Comando de inicialização
CMD ["npm", "start"]
