# ---------- Base image ----------
FROM node:22-alpine AS base
RUN apk add --no-cache gcompat python3 make g++ linux-headers
WORKDIR /app

# ---------- Builder stage ----------
FROM base AS builder

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and TypeScript config
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# ---------- Runner stage ----------
FROM node:22-alpine AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache gcompat

# Copy production files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

CMD ["node", "dist/index.js"]
