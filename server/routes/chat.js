import express from "express";
import {
  getMyChats,
  getChatById,
  createChat,
  saveMessage,
  deleteChat,
} from "../controllers/chatController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorizeRoles("user"));

router.get("/", getMyChats);
router.post("/", createChat);
router.get("/:id", getChatById);
router.put("/:id", saveMessage);
router.delete("/:id", deleteChat);

export default router;
