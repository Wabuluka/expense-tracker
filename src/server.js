import express from "express";
import dotenv from "dotenv";
import { initDB, sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRouter from "./routes/transactions.js";
dotenv.config();

const app = express();
app.use(rateLimiter);
app.use(express.json());

app.use("/api/transactions", transactionsRouter);

const PORT = process.env.PORT;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("App listening on port: ", PORT);
  });
});
