import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    const connection = await mongoose.connect(
      "mongodb://localhost:27017/eFreshCart"
    );
    if (connection) {
      console.log("Scuccess : MongoDB Connected");
    } else {
      console.log("Error: Connecting to database");
      process.exit(1);
    }
  } catch (error) {
    console.log("Error : Connecting to database - MongoDd" + error);
    process.exit(1);
  }
}

export default connectToDatabase;
