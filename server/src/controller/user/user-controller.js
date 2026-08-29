import mongoose from "mongoose";
import User from "../../model/User.js";

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      message: "successfully users fetched!",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Interval server error!",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password, isActive } = req.body;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Id not provided!",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User successfully updated!",
      data: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id not provided!",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Cascade delete only applies to owners who actually have a venue
    if (user.role === "owner" && user.venueId) {
      await MenuItem.deleteMany({ venueId: user.venueId }, { session });
      await Category.deleteMany({ venueId: user.venueId }, { session });
      await Venue.findByIdAndDelete(user.venueId, { session });
    }

    await User.findByIdAndDelete(user._id, { session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "User and associated data successfully deleted.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  } finally {
    session.endSession();
  }
};