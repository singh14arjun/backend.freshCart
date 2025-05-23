import e from "express";
import {
  emailVerification,
  generateForgetPasswordToken,
  signin,
  signout,
  singup,
  verifyOTPForgetPassword,
} from "../../../controllers/userrControllers.js";
import isAuthenticated from "../../../middlewares/auth.middlewares.js";

const router = e.Router();
router.get("/home", (req, res) => {
  return res.send("Hello Arjun");
});

router.route("/signup").post(singup);
router.route("/login").post(signin);
router.route("/signout").get(isAuthenticated, signout);
router
  .route("/login/forget-Password/generate")
  .post(generateForgetPasswordToken);
router.route("/login/forget-Password").post(verifyOTPForgetPassword);

// router.route("/send-otp").post(sendOTPToMail);
router.route("/email-verfication").post(emailVerification);

export default router;
