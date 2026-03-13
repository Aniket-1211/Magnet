import { User } from "../models/user.model.js";
import { signAccessToken } from "../utils/token.js";

export async function signup(req, res) {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "firstName, lastName, email, and password are required"
    });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone: phone || ""
  });

  const token = signAccessToken({ sub: user._id.toString(), role: user.role });

  return res.status(201).json({
    success: true,
    message: "Signup successful",
    data: {
      token,
      user: user.getPublicProfile()
    }
  });
}

export async function signin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: "Incorrect password" });
  }

  const token = signAccessToken({ sub: user._id.toString(), role: user.role });

  return res.status(200).json({
    success: true,
    message: "Signin successful",
    data: {
      token,
      user: user.getPublicProfile()
    }
  });
}

export async function verifyAuth(req, res) {
  return res.status(200).json({
    success: true,
    message: "Token is valid",
    data: {
      user: req.user.getPublicProfile()
    }
  });
}
