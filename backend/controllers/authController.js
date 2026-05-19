const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
exports.register = async (req, res) => {

  console.log("REGISTER API HIT");

  try {

    console.log("BODY:", req.body);

    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ username });

    console.log("EXISTING USER:", existingUser);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("PASSWORD HASHED");

    // Create admin
    const user = await User.create({
      username,
      password: hashedPassword,
      role: "admin",
    });

    console.log("USER CREATED");

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {

    console.log("REGISTER ERROR:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// LOGIN
exports.login = async (req, res) => {

  console.log("LOGIN API HIT");

  try {

    console.log("BODY:", req.body);

    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // Find user
    const user = await User.findOne({ username });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid username",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("TOKEN CREATED");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {

    console.log("LOGIN ERROR:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};