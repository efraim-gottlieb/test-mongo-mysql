import express from "express";
import * as messagesController from "../controllers/messages.js";
const router = express.Router();

router.route("/")
  .post(messagesController.createMessage)

export default router;
