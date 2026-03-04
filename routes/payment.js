import express from "express";
import snap from "../midtrans.js";
import Order from "../models/order.js";

const router = express.Router();


// ===============================
// CREATE TRANSACTION
// ===============================
router.post("/create", async (req, res) => {
  try {
    const { amount, name, email } = req.body;

    if (!amount || !name || !email) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
      });
    }

    const orderId = "ORDER-" + Date.now();

    // simpan ke database (pending)
    await Order.create({
      order_id: orderId,
      amount,
      name,
      email,
      status: "pending",
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: name,
        email: email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      message: "Transaksi berhasil dibuat",
      order_id: orderId,
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


// ===============================
// MIDTRANS NOTIFICATION
// ===============================
router.post("/notification", async (req, res) => {
  try {
    const statusResponse = await snap.transaction.notification(req.body);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let order = await Order.findOne({ order_id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    // logic update status
    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        order.status = "paid";
      }
    } 
    else if (transactionStatus === "settlement") {
      order.status = "paid";
    } 
    else if (transactionStatus === "pending") {
      order.status = "pending";
    } 
    else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      order.status = "failed";
    }

    await order.save();

    console.log("Order Updated:", orderId, order.status);

    res.sendStatus(200);

  } catch (error) {
    console.log("Notification error:", error.message);
    res.status(500).json({ message: "Notification error" });
  }
});


// ===============================
// CEK STATUS ORDER
// ===============================
router.get("/:order_id", async (req, res) => {
  try {
    const order = await Order.findOne({
      order_id: req.params.order_id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;