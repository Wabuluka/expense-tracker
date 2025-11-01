import express from "express";
import { sql } from "../config/db.js";
import {
  addTransaction,
  getUserTransactions,
  getUserTransactionSummary,
  deleteUserTransaction,
} from "../controller/transactions.js";

const transactionsRouter = express.Router();

transactionsRouter.post("/", addTransaction);

transactionsRouter.get("/:userId", getUserTransactions);

transactionsRouter.delete("/:id", deleteUserTransaction);

transactionsRouter.get("/summary/:userId", getUserTransactionSummary);

export default transactionsRouter;
