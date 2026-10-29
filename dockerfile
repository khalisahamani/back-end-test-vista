FROM node:22-slim

# Prisma needs OpenSSL
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (cached unless package files change)
COPY package*.json ./
RUN npm ci

# Generate the Prisma client
COPY prisma ./prisma
COPY prisma.config.ts ./
ENV DATABASE_URL="mysql://root:@localhost:3306/vista_test"
RUN npx prisma generate

# Compile TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]