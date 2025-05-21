import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes/index.routes.js";
import app from "./app.js";
import connectToDatabase from "./config/database.config.js";

const PORT = process.env.PORT || 5000;

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
    console.log("ERROR : Connecting to Database - MongoDB");
    process.exit(1);
  });
