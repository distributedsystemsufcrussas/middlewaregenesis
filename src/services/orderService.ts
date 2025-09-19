import { prismaShardA, prismaShardB } from "../config/prismaClients";

export const orderService = {
  async createOrder(data: { userId: number; productId: number }) {
    // Create shard A
    const orderA = await prismaShardA.orderA.create({
      data: {
        userId: data.userId,
      },
    });

    // Search product in shard B returning price
    const product = await prismaShardB.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    // Create order in shard B with product price
    const orderB = await prismaShardB.orderB.create({
      data: {
        productId: data.productId,
        totalPrice: product.price,
      },
    });

    return {
      id: `${orderA.id}-${orderB.id}`,
      userId: orderA.userId,
      productId: orderB.productId,
      totalPrice: orderB.totalPrice,
      createdAt: orderA.createdAt,
    };
  },

  async getOrders() {
    const ordersA = await prismaShardA.orderA.findMany();
    const ordersB = await prismaShardB.orderB.findMany();

    return ordersA.map((oa, i) => {
      const ob = ordersB[i];
      return {
        id: `${oa.id}-${ob.id}`,
        userId: oa.userId,
        productId: ob.productId,
        totalPrice: ob.totalPrice,
        createdAt: oa.createdAt,
      };
    });
  },
};
