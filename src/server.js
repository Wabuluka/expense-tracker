import express from "express";
import dotenv from "dotenv";
import { initDB, sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRouter from "./routes/transactions.js";
import job from "./config/cron.js";
dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start;

app.use(rateLimiter);
app.use(express.json());

app.get("/api/health", (req, res) => [res.status(200).json({ status: "Ok" })]);

app.use("/api/transactions", transactionsRouter);

const PORT = process.env.PORT;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("App listening on port: ", PORT);
  });
});
