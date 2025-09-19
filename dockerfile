# Etapa 1: build
FROM node:20 AS builder

WORKDIR /app

# Copia os manifests primeiro (cache melhor)
COPY package*.json ./

RUN npm install

# Copia código + schemas Prisma
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

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated

CMD ["node", "dist/index.js"]
