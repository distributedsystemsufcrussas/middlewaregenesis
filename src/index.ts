import express from "express";
import { userService } from "./services/userService.js";
import { productService } from "./services/productService.js";
import { orderService } from "./services/orderService.js";


const app = express();
app.use(express.json());

// testing routes
app.post("/users", async (req, res) => {
  const user = await userService.createUser(req.body);
  res.json(user);
});

app.get("/users", async (_, res) => {
  const users = await userService.getUsers();
  res.json(users);
});

app.post("/products", async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.json(product);
});

app.get("/products", async (_, res) => {
  const products = await productService.getProducts();
  res.json(products);
});

app.post("/orders", async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.json(order);
});

app.get("/orders", async (_, res) => {
  const orders = await orderService.getOrders();
  res.json(orders);
});

app.listen(3000, () => {
  console.log("Middleware rodando em http://localhost:3000");
});
