import express from "express";
import * as usersController from "../controllers/users.js";
const router = express.Router();

router.route("/register")
  .post(usersController.createUser)

// router.route("/:id")
//   .get(productsController.getProductById)
export default router;
