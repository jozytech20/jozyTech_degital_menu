import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Invalid token!",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden"
        });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ 
        success: false, 
        message: "Not authenticated"
     });
    }
  };
};