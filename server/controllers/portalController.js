import { Portal } from "../models/Portal.js";

export const createPortal = async (req, res) => {
  try {
    const { categoryId, level, state, city, portalName, portalUrl, description } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: "categoryId is required" });
    }
    if (!portalName || !portalName.trim()) {
      return res.status(400).json({ message: "portalName is required" });
    }
    if (!portalUrl || !portalUrl.trim()) {
      return res.status(400).json({ message: "portalUrl is required" });
    }
    if (!level || !["local", "state", "national"].includes(level)) {
      return res.status(400).json({ message: "level must be one of: local, state, national" });
    }

    const portal = await Portal.create({
      category: categoryId,
      level,
      state,
      city,
      portalName: portalName.trim(),
      portalUrl: portalUrl.trim(),
      description,
    });

    return res.status(201).json(portal);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error creating portal:", err);
    return res.status(500).json({ message: "Failed to create portal" });
  }
};

export const getPortals = async (_req, res) => {
  try {
    const portals = await Portal.find()
      .populate("category", "name description")
      .sort({ createdAt: -1 });

    return res.json(portals);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching portals:", err);
    return res.status(500).json({ message: "Failed to fetch portals" });
  }
};

export const getPortalById = async (req, res) => {
  try {
    const { id } = req.params;
    const portal = await Portal.findById(id).populate("category", "name description");

    if (!portal) {
      return res.status(404).json({ message: "Portal not found" });
    }

    return res.json(portal);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching portal:", err);
    return res.status(500).json({ message: "Failed to fetch portal" });
  }
};

export const getPortalsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { state, city } = req.query;

    const query = { category: categoryId };

    if (state || city) {
      const orConditions = [{ level: "national" }];
      
      if (state) {
        orConditions.push({ level: "state", state: { $regex: new RegExp(`^${state}$`, 'i') } });
      } else {
        orConditions.push({ level: "state" });
      }

      if (city) {
        if (state) {
          orConditions.push({ 
            level: "local", 
            state: { $regex: new RegExp(`^${state}$`, 'i') }, 
            city: { $regex: new RegExp(`^${city}$`, 'i') } 
          });
        } else {
          orConditions.push({ level: "local", city: { $regex: new RegExp(`^${city}$`, 'i') } });
        }
      } else {
        orConditions.push({ level: "local" });
      }

      query.$or = orConditions;
    }

    const portals = await Portal.find(query)
      .populate("category", "name description")
      .sort({ createdAt: -1 });

    return res.json(portals);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching portals by category:", err);
    return res.status(500).json({ message: "Failed to fetch portals by category" });
  }
};

