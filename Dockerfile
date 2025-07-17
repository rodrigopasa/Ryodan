# Dockerfile ultra simples para Coolify
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY . .

# Build
RUN npm run build

# Criar uploads
RUN mkdir -p uploads/pdfs uploads/thumbnails uploads/avatars uploads/temp

# Expor porta
EXPOSE 5000

# Start
CMD ["npm", "start"]
