import express from "express";
import * as authController from "../controllers/auth.js";
const router = express.Router();

router.route("/register")
  .post(authController.createUser)

export default router;
