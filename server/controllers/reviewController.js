import { Portal } from "../models/Portal.js";
import { PortalReview } from "../models/PortalReview.js";

export const createReview = async (req, res) => {
  try {
    const { portalId, rating, responseTimeRating, usabilityRating, reviewText } = req.body;

    if (!portalId) {
      return res.status(400).json({ message: "portalId is required" });
    }

    const numericFields = [
      ["rating", rating],
      ["responseTimeRating", responseTimeRating],
      ["usabilityRating", usabilityRating],
    ];

    for (const [field, value] of numericFields) {
      if (typeof value !== "number" || Number.isNaN(value)) {
        return res.status(400).json({ message: `${field} must be a number between 1 and 5` });
      }
      if (value < 1 || value > 5) {
        return res.status(400).json({ message: `${field} must be between 1 and 5` });
      }
    }

    const review = await PortalReview.create({
      portal: portalId,
      rating,
      responseTimeRating,
      usabilityRating,
      reviewText,
    });

    // Recalculate stats for the portal
    const stats = await PortalReview.aggregate([
      { $match: { portal: review.portal } },
      {
        $group: {
          _id: "$portal",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      const { avgRating, totalReviews } = stats[0];
      await Portal.findByIdAndUpdate(review.portal, {
        avgRating: Number(avgRating.toFixed(2)),
        totalReviews,
      });
    }

    return res.status(201).json(review);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error creating review:", err);
    return res.status(500).json({ message: "Failed to create review" });
  }
};

export const getReviewsForPortal = async (req, res) => {
  try {
    const { portalId } = req.params;

    const reviews = await PortalReview.find({ portal: portalId }).sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching reviews:", err);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

