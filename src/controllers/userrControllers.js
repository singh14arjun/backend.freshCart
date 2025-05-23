import User from "../models/user.models.js";
import Token from "../models/token.models.js";
import { cookieOptions } from "../constant/helper.constants.js";
import { sendEmail } from "../handlers/email.handlers.js";
import { sendEmailVerification } from "../handlers/email.handlers.js";
import { sendOTP } from "../handlers/otp.handlers.js";
import generateOTP from "../utils/generateOTP.js";

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

    // sending to welcome message to new user

    const emailResponse = await sendEmail(
      user.email,
      "Welcome to FreshCart!",
      `<h1>Welcome Mr/Mrs ${user.firstName}</h1>`
    );

    return res.status(201).json({
      message: "User Created Successfully!",
      user: {
        _id: user._id,
        firstName: user.firstName,
        emailResponse,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// signin
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
          password: user.password,
        },
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// signout or logout
export const signout = async (req, res, next) => {
  try {
    const user = req.user;
    const token = await Token.findOne({ user: user._id });

    token.refreshToken = {
      token: "",
      createdAt: "",
    };

    await token.save();
    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({
        message: "User signed-out successfully",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// forgetPassword
export const forgetPassword = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// send forget password otp to email
export const generateForgetPasswordToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(403).json({
        message: "Email fields are required!",
      });
    }

    const user = await User.findOne({ email });
    console.log(user.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = await Token.findOne({ user: user._id });

    const otpToken = await generateOTP(6);

    // passing required value to forgetPasswordtoken
    token.forgetPasswordToken = {
      token: otpToken,
      createdAt: Date.now(),
      tokenVerified: false,
    };

    // save the token
    await token.save();

    console.log("OTP IS : ", otpToken);

    await sendOTP(
      user.email,
      "OTP For Forget Password!",
      `<h1>Dear , ${user.firstName}</h1> <h2>Your OTP Is : ${otpToken}</h2>`
    );

    return res.status(200).json({
      message: "OTP Send to Your E-Mail",
      // otpResponse,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// verify otp for forgetPassword

export const verifyOTPForgetPassword = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email?.trim() || !otp?.trim()) {
    return res.status(403).json({
      message: "All fields are required!",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User Not found!",
    });
  }

  const token = await Token.findOne({ user: user._id });

  const createdAt = new Date(
    Number(token.forgetPasswordToken.createdAt) + 900000
  );
  const currentTime = new Date(Date.now());

  console.log(createdAt);
  console.log(currentTime);

  if (currentTime > createdAt) {
    return res.status(403).json({
      message: "OTP expired . Please regenearte!",
    });
  }

  if (token.forgetPasswordToken.token?.toString() !== otp?.toString()) {
    return res.status(403).json({
      message: "Invalid OTP ! Verification failed",
    });
  }

  token.forgetPasswordToken = {
    token: "",
    createdAt: "",
    tokenVerified: true,
  };

  await token.save();

  return res.status(200).json({
    message: "OTP verification Successful !",
  });
};

// changePassword
export const changePassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim) {
      return res.status(403).json({
        message: "All fields are required!",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found /Invalid User",
      });
    }

    const token = await Token.findOne({ user: user._id });

    if (!token.forgetPasswordToken.tokenVerified) {
      return res.status(401).json({
        message: "Access Denied due to Unauthorized access detected",
      });
    }

    user.password = password;
    await user.save();

    token.forgetPasswordToken = {
      token: "",
      createdAt: "",
      tokenVerified: false,
    };
    await token.save();

    return res.status(200).json({
      message: "Password changed succesfully !",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// generating email Verification token
export const generateEmailVerificationToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(403).json({
        message: "All files are required.",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const token = await Token.findOne({ user: user._id });
    const otpToken = await generateOTP(6);

    const emailVerificationRequest = await sendEmailVerification(
      user.email,
      "Email Verification OTP ",
      `<h2 style="color: red;">Your email verification Code is : ${otpToken}</h2>`
    );

    token.emailVerificatonToken = {
      token: otpToken,
      createdAt: Date.now(),
      tokenVerified: false,
    };

    await token.save();
    return res.status(200).json({
      message: "Capatcha send to Your e-mail",
      emailVerificationRequest,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// email verification via otp
export const emailVerification = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email?.trim() || !otp?.trim()) {
      return res.status(403).json({
        message: "All fields are required!",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User Not found!",
      });
    }

    const token = await Token.findOne({ user: user._id });

    const createdAt = new Date(
      Number(token.emailVerificatonToken.createdAt) + 900000
    );

    const currentTime = new Date(Date.now());

    if (currentTime > createdAt) {
      token.emailVerificatonToken = {
        token: "",
        createdAt: "",
        tokenVerified: true,
      };
      await token.save();
      return res.status(403).json({
        message: "OTP Expired Try Again",
      });
    }

    if (token.emailVerificatonToken.token?.toString() !== otp.toString()) {
      return res.status(403).json({
        message: "OTP verification failed!",
      });
    }

    token.emailVerificatonToken = {
      token: "",
      createdAt: "",
      tokenVerified: true,
    };
    await token.save();

    return res.status(200).json({
      message: "OTP Verificaton successfull!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// tfa
export const tfa = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};
