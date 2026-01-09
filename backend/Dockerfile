# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm build

# Development stage (used by docker-compose)
FROM node:18-alpine AS production

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for tsx in dev mode)
RUN pnpm install

# Copy source code and built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Expose port
EXPOSE 3000

# Start the application (can be overridden by docker-compose)
CMD ["node", "dist/server.js"]
