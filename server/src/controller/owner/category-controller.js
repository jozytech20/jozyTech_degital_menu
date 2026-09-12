import Category from "../../model/Category.js";
import MenuItem from "../../model/MenuItem.js";
import { deleteCloudinaryImage } from "../Image/deleteCloudinaryImage.js";


export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const id = req.user.venueId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const category = await Category.create({
      venueId: id,
      name,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Category Successfully Created.",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
}

export const fetchCategory = async (req, res) => {
  try {
    const id = req.user.venueId;

    const categories = await Category.find({ venueId: id });

    res.status(200).json({
      success: true,
      message: "categories successfully fetched.",
      data: categories,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!"
    });
  }
}

export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const venueId = req.user.venueId;
    const { name, description, image, imagePublicId, isActive } = req.body;

    const category = await Category.findOne({ _id: id, venueId: venueId })
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "category not found!"
      })
    }

    if (image && image !== category.image) {
      await deleteCloudinaryImage(category.imagePublicId);
      category.image = image;
      category.imagePublicId = imagePublicId; // needs to be destructured from req.body too
    }

    if (name) category.name = name;
    if (description) category.description = description;
    if (image) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      success: true,
      message: "category successfully updated!",
      data: category
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!"
    })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const venueId = req.user.venueId;

    const itemCount = await MenuItem.countDocuments({ categoryId: id, venueId });
    if (itemCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category — it still has ${itemCount} menu item(s). Move or delete them first.`,
      });
    }

    await deleteCloudinaryImage(category.imagePublicId);

    const category = await Category.findOneAndDelete({
      _id: id,
      venueId: venueId,
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "category not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "category successfully deleted!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!"
    })
  }
}