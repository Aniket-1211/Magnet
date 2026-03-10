import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/token.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Unauthorized: token missing" });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: "Unauthorized: invalid token" });
  }
}
