import e from "express";
import apiRouter from "./api/index.routes.js";
const router = e.Router();

router.use("/api", apiRouter);

export default router;
