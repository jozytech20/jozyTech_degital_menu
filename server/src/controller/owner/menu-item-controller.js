import Category from "../../model/Category.js";
import MenuItem from "../../model/MenuItem.js";



export const createMenuItem = async(req, res) =>{
 try {
    const venueId = req.user.venueId;
    const createdBy = req.user.id
    const {
      categoryId,
      name,
      description,
      price,
      variants,
      image,
      isAvailable,
      isFeatured,
    } = req.body;

    if (!categoryId || !name || !description || !price ) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const category = await Category.findOne({ _id: categoryId, venueId });
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const menuItem = await MenuItem.create({
      venueId,
      categoryId,
      name,
      description,
      price,
      variants,
      image,
      isAvailable,
      isFeatured,
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: "Menu Item Successfully Created.",
      data: menuItem,
    });


 } catch (error) {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error!",
  });
 }
}

export const fetchMenuItems = async(req, res)=>{
  try {
    const venueId = req.user.venueId;
    const { search, categoryId } = req.query;

    const filter = { venueId };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const menuItems = await MenuItem.find(filter);

    res.status(200).json({
      success: true,
      message: "menu items successfully fetched.",
      data: menuItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
}

export const updateMenuItem = async (req, res)=>{
  try {
    const venueId = req.user.venueId;
    const id = req.params.id;
    const {
      categoryId,
      name,
      description,
      price,
      image,
      isAvailable,
      isFeatured,
    } = req.body;

    if(!id){
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const menuItem = await MenuItem.findOne({ _id : id, venueId})
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu Item Not Found!",
      });
    }

    if (categoryId) {
      const category = await Category.findOne({ _id: categoryId, venueId });
      if (!category) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category" });
      }
      menuItem.categoryId = categoryId;
    }

    if(name) menuItem.name = name;
    if(description) menuItem.description = description;
    if(price) menuItem.price = price;
    if(image) menuItem.image = image;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;
    if (isFeatured !== undefined) menuItem.isFeatured = isFeatured;

     await menuItem.save();    

    res.status(200).json({
      success: true,
      message: "menuItem successfully updated!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
}

export const deleteMenuItem = async (req, res)=>{
  try {
    const id = req.params.id
    const venueId = req.user.venueId;

    if(!id){
      return res.status(400).json({
      success : false,
      message : "Invalid credentials!"
    })
    }
    
    const menuItem = await MenuItem.findOneAndDelete({ _id: id, venueId })
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "menu item not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "menu item deleted successfully!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success : false,
      message : "Internal server error!"
    })
  }
}