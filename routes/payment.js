import express from "express";
import snap from "../midtrans.js";

const router = express.Router();

router.post("/create-transaction", async (req, res) => {
  try {
    const { order_id, amount, name, email } = req.body;

    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: amount,
      },
      customer_details: {
        first_name: name,
        email: email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal membuat transaksi",
      message: error.message,
    });
  }
});

export default router;