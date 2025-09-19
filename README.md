# Sharding Middleware (Users + Products)

This repo implements a **middleware** that bridges two sharded databases utilizing **Prisma ORM**.

## Shard Structure

- **Shard A**  
  Contains:
  - `User`
  - `OrderA` (orders linked to users)

- **Shard B**  
  Contém:
  - `Product`
  - `OrderB` (orders linked to products)

## Why duplicate `Order`?

Prisma doest support foreign keys between multiple datasources.  
So, the strategy is to duplicate the `Order` table:  

- `OrderA` references `User` (Shard A)  
- `OrderB` references `Product` (Shard B)  

The middleware joins two infos whan the complete order is requested.

## Fluxo de funcionamento

1. **App Cliente** → chama o middleware  
2. **Middleware** → decide em qual shard fazer a operação  
3. **Prisma Clients** → conectam a shardA ou shardB  
4. Resultado é unificado e devolvido para o cliente.

## Como rodar

```bash
npm install
npx prisma generate --schema=prisma/schema.shardA.prisma
npx prisma generate --schema=prisma/schema.shardB.prisma
npm run dev
