import express from "express";
import * as messagesController from "../controllers/messages.js";
const router = express.Router();

router.route("/")
  .get(messagesController.getAllMessages)

router.route("/encrypt")
  .post(messagesController.encrypt)

router.route("/decrypt")
  .post(messagesController.decrypt)
export default router;
