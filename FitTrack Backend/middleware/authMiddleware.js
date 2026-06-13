const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    console.log("\n========== AUTH MIDDLEWARE ==========");

    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    // Check if header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Bearer token found");
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    console.log("Token Received:", token);

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("✅ JWT Verified");
      console.log("Decoded Payload:", decoded);
    } catch (err) {
      console.log("❌ JWT Verification Failed");
      console.log("Reason:", err.message);

      return res.status(401).json({
        message: "Invalid token",
        error: err.message,
      });
    }

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ User not found in database");
      console.log("User ID from token:", decoded.id);

      return res.status(401).json({
        message: "User not found",
      });
    }

    console.log("✅ User Found");
    console.log("User ID:", user._id);
    console.log("Email:", user.email);

    req.user = user;

    console.log("========== AUTH SUCCESS ==========\n");

    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error");
    console.error(err);

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

module.exports = auth;