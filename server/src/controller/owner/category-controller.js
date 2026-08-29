import Category from "../../model/Category.js";


export const createCategory = async(req, res) =>{
  try {
    const { name, description, image } = req.body;
    const id = req.user.venueId;

    if(!name){
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

export const fetchCategory = async(req, res) =>{
 try {
  const id = req.user.venueId;

  const categories = await Category.find({ venueId : id });

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

export const updateCategory = async(req, res)=>{
  try {
    const id = req.params.id;   //
    const venueId = req.user.venueId;
    const { name, description, image, isActive} = req.body;

    const category = await Category.findOne({ _id : id, venueId: venueId })
    if(!category){
      return res.status(404).json({
        success: false,
        message: "category not found!"
      })
    }

    if(name) category.name = name;
    if(description) category.description = description;
    if(image) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      success : true,
      message : "category successfully updated!",
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success : false,
      message : "Internal server error!"
    })
  }
}

export const deleteCategory = async(req, res)=>{
  try {
    const id = req.params.id;
    const venueId = req.user.venueId;

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
      success : false,
      message : "Internal server error!"
    })
  }
}