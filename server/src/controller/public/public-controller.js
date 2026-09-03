import Category from "../../model/Category.js";
import MenuItem from "../../model/MenuItem.js";

export const getPublicMenu = async (req, res) => {
  try {
    const venueId = req.venue._id;

    const categories = await Category.find({ venueId, isActive: true }).sort({
      sortOrder: 1,
    });
    const menuItems = await MenuItem.find({ venueId, isAvailable: true });

    const menu = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image,
      items: menuItems.filter(
        (item) => item.categoryId.toString() === category._id.toString(),
      ),
    }));

    res.status(200).json({
      success: true,
      message: "menu fetched successfully",
      data: {
        venue: {
          name: req.venue.name,
          branding: req.venue.branding,
          email: req.venue.email,
          phone: req.venue.phone,
          website: req.venue.website,
        },
        menu,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error!" 
    });
  }
};

export const searchPublicMenu = async (req, res) => {
  try {
    const venueId = req.venue._id;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const items = await MenuItem.find({
      venueId,
      isAvailable: true,
      name: { $regex: q, $options: "i" },
    });

    res.status(200).json({
      success: true,
      message: "search results fetched successfully",
      data: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error!" 
    });
  }
};