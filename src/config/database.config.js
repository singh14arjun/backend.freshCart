import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log(uri);

    const connection = await mongoose.connect(uri);

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
