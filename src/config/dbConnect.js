import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const mongoDbConnection = await connect(
      process.env.MONOGODB_CONNECTION_STRING,
      { dbName: process.env.DB_NAME }
    );
    console.log(
      `database connection successfull ${mongoDbConnection.connection.host}`
    );
  } catch (error) {
    console.log(`database connection failed ${error}`);
  }
};

export default connectDB;
