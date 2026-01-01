import express from "express";
import * as orderdsController from "../controllers/orders.js";
const router = express.Router();

router.route("/")
  .get(orderdsController.getOrders)
  .post(orderdsController.createOrder)

router.route("/:id")
  .get(orderdsController.getOrderById)

export default router;
