import e from "express";
import { singup } from "../../../controllers/userrControllers.js";

const router = e.Router();
router.get("/home", (req, res) => {
  return res.send("Hello Arjun");
});

router.route("/signup").post(singup);
export default router;
