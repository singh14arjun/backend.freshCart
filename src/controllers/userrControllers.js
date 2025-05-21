import User from "../models/user.models.js";

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
