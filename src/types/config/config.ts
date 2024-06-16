import dotenv from "dotenv";
dotenv.config();
const config = {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
};
export default config;
