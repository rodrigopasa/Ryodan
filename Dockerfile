# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Install build dependencies including Python and build tools
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    py3-pip \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pkgconfig \
    libjpeg-turbo-dev

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY drizzle.config.ts ./

# Install dependencies with Python available
ENV PYTHON=/usr/bin/python3
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install only production dependencies in a separate step
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Production stage
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    cairo \
    jpeg \
    pango \
    musl \
    giflib \
    pixman \
    libjpeg-turbo

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create necessary directories
RUN mkdir -p uploads/pdfs uploads/thumbnails uploads/avatars uploads/temp
RUN chown -R nextjs:nodejs uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
