import { Category } from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Category with this name already exists" });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
    });

    return res.status(201).json(category);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error creating category:", err);
    return res.status(500).json({ message: "Failed to create category" });
  }
};

export const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json(categories);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching categories:", err);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
};

