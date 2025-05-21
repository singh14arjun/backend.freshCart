import e from "express";
import { signin, singup } from "../../../controllers/userrControllers.js";

const router = e.Router();
router.get("/home", (req, res) => {
  return res.send("Hello Arjun");
});

router.route("/signup").post(singup);
router.route("/login").post(signin);
export default router;
