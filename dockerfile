# Etapa 1: build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copia código + schemas + config
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Gera os clients do Prisma para os dois shards
RUN npx prisma generate --schema=prisma/schema.shardA.prisma
RUN npx prisma generate --schema=prisma/schema.shardB.prisma

# Compila o TypeScript
RUN npm run build

# Etapa 2: runtime
FROM node:20-slim

WORKDIR /app

# Copia apenas o necessário
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated

CMD ["node", "dist/index.js"]
