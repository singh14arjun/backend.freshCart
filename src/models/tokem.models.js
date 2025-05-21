import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    emailVerificatonToken: {
      token: String,
      createdAt: Date,
    },
    tfaToken: {
      token: String,
      createdAt: Date,
    },
    forgetPassword: {
      token: String,
      createdAt: Date,
    },
  },
  {
    timeseries: true,
  }
);

const Token = mongoose.model("Token", tokenSchema);
export default Token;
