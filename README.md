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

## Workflux 

1. **Client App** → Calls middleware  
2. **Middleware** → decides on which shard do the query  
3. **Prisma Clients** → conects to shardA or shardB  
4. Result is unified and sent back to client.

## Commands

```bash
npm install
npx tsc -init
npx prisma generate --schema=prisma/schema.shardA.prisma
npx prisma generate --schema=prisma/schema.shardB.prisma
npm run dev
