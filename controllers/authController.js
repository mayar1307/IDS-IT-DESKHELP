const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

async function register(req, res) {
  try {
    const { name, email, password, roleId, departmentId } = req.body;

    if (!name || !email || !password || !roleId) {
      return res.status(400).json({
        message: "Name, email, password, and roleId are required."
      });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM User WHERE Email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO User (Name, Email, Password, RoleId, DepartmentId)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, roleId, departmentId || null]
    );

    await logActivity({
      action: "LOGIN",
      entityId: user.UserId,
      entityType: "User",
      userId: user.UserId
    });

    res.status(201).json({
      message: "User registered successfully."
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed.",
      error: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const [users] = await db.query(
      `SELECT 
        User.UserId,
        User.Name,
        User.Email,
        User.Password,
        Role.RoleName
       FROM User
       JOIN Role ON User.RoleId = Role.RoleId
       WHERE User.Email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(password, user.Password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        userId: user.UserId,
        role: user.RoleName
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        userId: user.UserId,
        name: user.Name,
        email: user.Email,
        role: user.RoleName
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed.",
      error: error.message
    });
  }
}

function forgotPassword(req, res) {
  res.json({
    message: "Forgot password feature will be implemented later."
  });
}

module.exports = {
  register,
  login,
  forgotPassword
};
