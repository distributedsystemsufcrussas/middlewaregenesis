import { prismaShardA } from "../config/prismaClients.js";

export const userService = {
  async createUser(data: { email: string; name: string }) {
    return prismaShardA.user.create({ data });
  },

  async getUsers() {
    return prismaShardA.user.findMany();
  },
};
