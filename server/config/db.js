import mongoose from "mongoose";
import { Category } from "../models/Category.js";
import { Portal } from "../models/Portal.js";
import { PortalReview } from "../models/PortalReview.js";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export const seedInitialData = async () => {
  const existingCategories = await Category.estimatedDocumentCount();
  if (existingCategories > 0) {
    return;
  }

  const municipal = await Category.create({
    name: "Municipal",
    description: "Municipal and civic grievance portals",
  });

  const portals = [
    {
      category: municipal._id,
      level: "national",
      state: "",
      city: "",
      portalName: "CPGRAMS",
      portalUrl: "https://pgportal.gov.in",
      description: "Centralized Public Grievance Redress and Monitoring System",
    },
    {
      category: municipal._id,
      level: "state",
      state: "Andhra Pradesh",
      city: "",
      portalName: "Andhra Pradesh Municipal Grievance",
      portalUrl: "https://cdma.ap.gov.in/en/grievance-citizen-services",
      description: "State-level municipal grievance portal for Andhra Pradesh",
    },
    {
      category: municipal._id,
      level: "local",
      state: "Telangana",
      city: "Hyderabad",
      portalName: "GHMC Complaint Portal",
      portalUrl: "https://ghmc.gov.in",
      description: "Municipal civic complaint portal for Hyderabad",
    },
  ];

  const insertedPortals = await Portal.insertMany(portals);

  const seededReviews = [
    // CPGRAMS
    {
      portal: insertedPortals[0]._id,
      rating: 4,
      responseTimeRating: 3,
      usabilityRating: 4,
      reviewText: "Easy to submit a grievance, status tracking is helpful.",
    },
    {
      portal: insertedPortals[0]._id,
      rating: 3,
      responseTimeRating: 3,
      usabilityRating: 3,
      reviewText: "Submission works fine, but responses can take time depending on department.",
    },
    // Andhra Pradesh Municipal
    {
      portal: insertedPortals[1]._id,
      rating: 4,
      responseTimeRating: 4,
      usabilityRating: 4,
      reviewText: "Good portal for municipal issues. Clear categories and decent turnaround.",
    },
    {
      portal: insertedPortals[1]._id,
      rating: 2,
      responseTimeRating: 2,
      usabilityRating: 3,
      reviewText: "UI is okay, but updates on complaint progress were inconsistent.",
    },
    // GHMC
    {
      portal: insertedPortals[2]._id,
      rating: 5,
      responseTimeRating: 4,
      usabilityRating: 5,
      reviewText: "Complaint was acknowledged quickly and the interface is straightforward.",
    },
    {
      portal: insertedPortals[2]._id,
      rating: 3,
      responseTimeRating: 3,
      usabilityRating: 4,
      reviewText: "Works most of the time. Would like better tracking and notifications.",
    },
  ];

  await PortalReview.insertMany(seededReviews);

  const stats = await PortalReview.aggregate([
    {
      $group: {
        _id: "$portal",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await Promise.all(
    stats.map((s) =>
      Portal.findByIdAndUpdate(s._id, {
        avgRating: Number(s.avgRating.toFixed(2)),
        totalReviews: s.totalReviews,
      }),
    ),
  );
  // eslint-disable-next-line no-console
  console.log("Seeded initial category, portals, and reviews");
};

