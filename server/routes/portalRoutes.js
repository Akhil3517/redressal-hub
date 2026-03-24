import express from "express";
import {
  createPortal,
  getPortalById,
  getPortals,
  getPortalsByCategory,
} from "../controllers/portalController.js";

const router = express.Router();

router.post("/", createPortal);
router.get("/", getPortals);
router.get("/category/:categoryId", getPortalsByCategory);
router.get("/:id", getPortalById);

export default router;

