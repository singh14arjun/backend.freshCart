import e from "express";
import v1Router from "./v1/index.routes.js";

const router = e.Router();
router.use("/v1", v1Router);
export default router;
