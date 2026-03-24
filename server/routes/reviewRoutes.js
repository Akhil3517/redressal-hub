import express from "express";
import { createReview, getReviewsForPortal } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/:portalId", getReviewsForPortal);

export default router;

