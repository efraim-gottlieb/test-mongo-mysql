import express from "express";
import * as usersController from "../controllers/users.js"
const router = express.Router();

router.route("/me")
  .get(usersController.getMessagesCount)

export default router;
