import express from "express";

import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/book.routes";
import mongoose from "mongoose";
import config from "./types/config/config";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

mongoose.set("strictQuery", true);

mongoose
  .connect(config.mongodbUri!, {
    //@ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
