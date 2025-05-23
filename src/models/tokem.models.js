import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    refreshToken: {
      token: String,
      createdAt: Date,
    },

    emailVerificatonToken: {
      token: String,
      createdAt: Date,
    },
    tfaToken: {
      token: String,
      createdAt: Date,
    },
    forgetPasswordToken: {
      token: String,
      createdAt: Date,
      tokenVerified: Boolean,
    },
  },
  {
    timeseries: true,
  }
);

const Token = mongoose.model("Token", tokenSchema);
export default Token;
