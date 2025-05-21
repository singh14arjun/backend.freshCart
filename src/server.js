import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.routes.js";
import app from "./app.js";
import connectToDatabase from "./config/database.config.js";

const PORT = process.env.PORT || 4000;

dotenv.config();
app.use("/", router);

connectToDatabase()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log(`ERROR : Connecting to Server at ${PORT}`);
        return;
      }
      console.log(`SUCCESS : Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("ERROR : Connecting to Databse - mOngoDB");
    process.exit(1);
  });
