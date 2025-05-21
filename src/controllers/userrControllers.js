import User from "../models/user.models.js";
import Token from "../models/tokem.models.js";
import { cookieOptions } from "../constant/helper.constants.js";

export const singup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {
      return res.status(403).json({
        message: "All fields are requried",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User Already exists ! Please Sign In",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    return res.status(201).json({
      message: "User Created Successfully!",
      user: {
        _id: user._id,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(403).json({
        message: "All fields are requried",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Invalid Email or Password",
      });
    }

    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid) {
      return res.status(404).json({
        message: "Invalid Email / Password",
      });
    }
    // Create Season for Singin
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    const token = await Token.findOne({ user: user._id });
    if (token) {
      token.refreshToken = {
        token: refreshToken,
        createdAt: Date.now(),
      };
    } else {
      await Token.create({
        user: user._id,
        refreshToken: {
          token: refreshToken,
          createdAt: Date.now(),
        },
      });
    }

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        message: `Welcome Mr/Mrs : ${user.firstName}`,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const signout = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const forgetPasswor = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const changePassword = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const emailVerification = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const tfa = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};
