import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Portal } from "../models/Portal.js";
import { PortalReview } from "../models/PortalReview.js";

dotenv.config();

const DEFAULT_MONGO_URI = "mongodb://localhost:27017/ai_grievance_dashboard";

const reviewTemplates = {
  CPGRAMS: [
    { rating: 4, responseTimeRating: 3, usabilityRating: 4, reviewText: "Easy to submit a grievance; tracking is useful." },
    { rating: 3, responseTimeRating: 3, usabilityRating: 3, reviewText: "Submission is smooth, but responses vary by department." },
    { rating: 4, responseTimeRating: 4, usabilityRating: 3, reviewText: "Good overall. Status updates could be clearer." },
  ],
  "Andhra Pradesh Municipal Grievance": [
    { rating: 4, responseTimeRating: 4, usabilityRating: 4, reviewText: "Clear categories and a decent turnaround time." },
    { rating: 3, responseTimeRating: 3, usabilityRating: 4, reviewText: "Works fine, but sometimes slow during peak hours." },
    { rating: 2, responseTimeRating: 2, usabilityRating: 3, reviewText: "Updates were inconsistent for my complaint." },
  ],
  "GHMC Complaint Portal": [
    { rating: 5, responseTimeRating: 4, usabilityRating: 5, reviewText: "Acknowledged quickly; easy interface." },
    { rating: 4, responseTimeRating: 3, usabilityRating: 4, reviewText: "Good portal, could improve notifications." },
    { rating: 3, responseTimeRating: 3, usabilityRating: 4, reviewText: "Mostly reliable. Tracking could be better." },
  ],
};

async function recomputePortalStats(portalId) {
  const stats = await PortalReview.aggregate([
    { $match: { portal: new mongoose.Types.ObjectId(portalId) } },
    {
      $group: {
        _id: "$portal",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length === 0) return;

  await Portal.findByIdAndUpdate(portalId, {
    avgRating: Number(stats[0].avgRating.toFixed(2)),
    totalReviews: stats[0].totalReviews,
  });
}

async function ensureMunicipalCategory() {
  let municipal = await Category.findOne({ name: "Municipal" });
  if (!municipal) {
    municipal = await Category.create({
      name: "Municipal",
      description: "Municipal and civic grievance portals",
    });
  }
  return municipal;
}

async function ensureDefaultPortals(categoryId) {
  const defaults = [
    {
      portalName: "CPGRAMS",
      level: "national",
      state: "",
      city: "",
      portalUrl: "https://pgportal.gov.in",
      description: "Centralized Public Grievance Redress and Monitoring System",
    },
    {
      portalName: "Andhra Pradesh Municipal Grievance",
      level: "state",
      state: "Andhra Pradesh",
      city: "",
      portalUrl: "https://cdma.ap.gov.in/en/grievance-citizen-services",
      description: "State-level municipal grievance portal for Andhra Pradesh",
    },
    {
      portalName: "GHMC Complaint Portal",
      level: "local",
      state: "Telangana",
      city: "Hyderabad",
      portalUrl: "https://ghmc.gov.in",
      description: "Municipal civic complaint portal for Hyderabad",
    },
  ];

  const portals = [];
  for (const d of defaults) {
    let p = await Portal.findOne({ portalName: d.portalName });
    if (!p) {
      p = await Portal.create({
        category: categoryId,
        ...d,
      });
    }
    portals.push(p);
  }
  return portals;
}

async function seedDummyReviews() {
  const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  process.env.MONGO_URI = mongoUri;

  await connectDB();

  const municipal = await ensureMunicipalCategory();
  const portals = await ensureDefaultPortals(municipal._id);

  for (const portal of portals) {
    const templates = reviewTemplates[portal.portalName] || [];
    if (templates.length === 0) continue;

    const existingCount = await PortalReview.countDocuments({ portal: portal._id });
    if (existingCount > 0) {
      // eslint-disable-next-line no-console
      console.log(`Skipping ${portal.portalName}: already has ${existingCount} reviews`);
      continue;
    }

    await PortalReview.insertMany(
      templates.map((t) => ({
        portal: portal._id,
        ...t,
      })),
    );

    await recomputePortalStats(portal._id);
    // eslint-disable-next-line no-console
    console.log(`Seeded ${templates.length} reviews for ${portal.portalName}`);
  }

  await mongoose.disconnect();
}

seedDummyReviews()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Done seeding dummy reviews");
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", err);
    process.exit(1);
  });

