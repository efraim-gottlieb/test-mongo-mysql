import express from "express";
import * as productsController from "../controllers/products.js";
const router = express.Router();

router.route("/")
  .get(productsController.getProducts)
  .post(productsController.createProduct)

router.route("/:id")
  .get(productsController.getProductById)
export default router;
