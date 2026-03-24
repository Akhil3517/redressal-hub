import express from "express";
import { analyzeQuery, generateComplaint } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze-query", analyzeQuery);
router.post("/generate-complaint", generateComplaint);

export default router;
