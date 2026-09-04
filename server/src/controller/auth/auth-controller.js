import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials!",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials!",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials!",
    });
  }

  const token = jwt.sign(
    {
      role: user.role,
      id: user._id,
      venueId: user.venueId,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      role: user.role,
      venueId: user.venueId,
    },
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "user fetched",
      data: {
        id: user._id,
        name: user.name,
        role: user.role,
        venueId: user.venueId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};