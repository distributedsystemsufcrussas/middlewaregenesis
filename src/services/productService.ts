import { prismaShardB } from "../config/prismaClients.js";

export const productService = {
  async createProduct(data: { name: string; price: number }) {
    return prismaShardB.product.create({ data });
  },

  async getProducts() {
    return prismaShardB.product.findMany();
  },
};
