import { sql } from "../config/db.js";

export async function addTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !user_id || !category || !user_id) {
      res.status(400).json({ message: "All fields must be provided" });
    }
    const transaction =
      await sql`INSERT INTO transactions(user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserTransactions(req, res) {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUserTransaction(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id)))
      res.status(400).json({ message: "Invalid id provided" });
    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (result.length === 0)
      res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserTransactionSummary(req, res) {
  try {
    const { userId } = req.params;
    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}`;
    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} and amount > 0`;
    const expenseResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${userId} and amount < 0`;
    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expenseResult[0].expense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
