import e from "express";
import {
  signin,
  signout,
  singup,
} from "../../../controllers/userrControllers.js";
import isAuthenticated from "../../../middlewares/auth.middlewares.js";

const router = e.Router();
router.get("/home", (req, res) => {
  return res.send("Hello Arjun");
});

router.route("/signup").post(singup);
router.route("/login").post(signin);
router.route("/signout").get(isAuthenticated, signout);

export default router;
