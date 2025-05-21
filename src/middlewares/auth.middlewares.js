import JWT from "jsonwebtoken";
import User from "../models/user.models.js";

const isAuthenticated = async (req, res, next) => {
  try {
    console.log("Hello");
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({
        message: "Un-Authorized access Detected 1",
      });
    }
    const decodedAccesToken = await JWT.decode(accessToken);
    if (!decodedAccesToken) {
      return res.status(401).json({
        message: "Un-Authorized access Detected 2",
      });
    }

    const user = await User.findById(decodedAccesToken._id);

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Un-Authorized Access Detected 3",
    });
  }
};

export default isAuthenticated;
