import { prismaShardB } from "../config/prismaClients";

export const productService = {
  async createProduct(data: { name: string; price: number }) {
    return prismaShardB.product.create({ data });
  },

  async getProducts() {
    return prismaShardB.product.findMany();
  },
};
