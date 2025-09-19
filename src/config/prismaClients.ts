import { PrismaClient as PrismaClientShardA } from "../generated/shardA";
import { PrismaClient as PrismaClientShardB } from "../generated/shardB";

export const prismaShardA = new PrismaClientShardA();
export const prismaShardB = new PrismaClientShardB();
