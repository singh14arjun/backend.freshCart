import e from "express";
import {
  changePassword,
  emailVerification,
  generateEmailVerificationToken,
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
router.route("/forget-Password/generate").post(generateForgetPasswordToken);
router.route("/forget-Password").post(verifyOTPForgetPassword);
router.route("/change-Password").post(changePassword);
router
  .route("/email-verification/generate")
  .post(generateEmailVerificationToken);

router.route("/email-verification").post(emailVerification);
// router.route("/send-otp").post(sendOTPToMail);

export default router;
