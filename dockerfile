# Etapa 1: builder - Usando uma imagem baseada em Debian Bullseye
FROM node:20-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Gera os clients do Prisma. Agora ele irá gerar o binário para OpenSSL 1.1.x
# devido ao binaryTargets e à imagem base.
RUN npx prisma generate --schema=prisma/schema.shardA.prisma
RUN npx prisma generate --schema=prisma/schema.shardB.prisma

# Compila o código TypeScript para JavaScript
RUN npm run build

# Opcional: remove dependências de desenvolvimento
RUN npm prune --omit=dev


# Etapa 2: runtime - Usando a mesma base slim para consistência
FROM node:20-bullseye-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./dist/generated

# Copia os schemas para o runtime, pois o Prisma pode precisar deles
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/index.js"]