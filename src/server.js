import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.routes.js";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

dotenv.config();
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
