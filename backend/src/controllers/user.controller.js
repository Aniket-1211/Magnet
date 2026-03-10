import { User } from "../models/user.model.js";

export async function getMyProfile(req, res) {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    data: user
  });
}

export async function updateMyProfile(req, res) {
  const allowedFields = ["firstName", "lastName", "email", "phone"];
  const updates = {};

  for (const field of allowedFields) {
    if (typeof req.body[field] === "string") {
      const value = req.body[field].trim();
      updates[field] = field === "email" ? value.toLowerCase() : value;
    }
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ success: false, message: "No valid fields to update" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }
    throw error;
  }
}
