import { PrismaClient as PrismaClientShardA } from "../generated/shardA/index.js";
import { PrismaClient as PrismaClientShardB } from "../generated/shardB/index.js";

export const prismaShardA = new PrismaClientShardA();
export const prismaShardB = new PrismaClientShardB();
