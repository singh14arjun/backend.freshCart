import e from "express";

const router = e.Router();
router.get("/home", (req, res) => {
  return res.send("Hello Arjun");
});

export default router;
