import mongoose from "mongoose";

const portalReviewSchema = new mongoose.Schema(
  {
    portal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portal",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    responseTimeRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    usabilityRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const PortalReview = mongoose.model("PortalReview", portalReviewSchema);

