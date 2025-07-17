# Dockerfile simples e robusto
FROM node:20-alpine

# Instalar dependências básicas
RUN apk add --no-cache curl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro
COPY package*.json ./

# Instalar dependências sem cache e sem opcional
RUN npm install --no-cache --no-optional

# Copiar arquivos de configuração
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY drizzle.config.ts ./

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Limpar cache npm
RUN npm cache clean --force

# Criar diretórios necessários
RUN mkdir -p uploads/pdfs uploads/thumbnails uploads/avatars uploads/temp

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Definir permissões
RUN chown -R nextjs:nodejs uploads dist public

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 5000

# Comando de inicialização
CMD ["npm", "start"]
