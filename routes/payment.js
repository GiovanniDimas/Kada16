import express from "express";
import snap from "../midtrans.js";
import Order from "../models/order.js";

const router = express.Router();


// =================================
// CREATE TRANSACTION
// =================================
router.post("/create", async (req, res) => {
  try {
    const { amount, name, email } = req.body;

    if (!amount || !name || !email) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
      });
    }

    const orderId = "ORDER-" + Date.now();

    // simpan order ke database
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


// =================================
// HANDLE MIDTRANS NOTIFICATION
// =================================
const handleNotification = async (req, res) => {
  try {

    const notification = req.body;

    const statusResponse = await snap.transaction.notification(notification);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    let order = await Order.findOne({ order_id: orderId });

    if (!order) {
      return res.status(404).json({
        message: "Order tidak ditemukan",
      });
    }

    // =================================
    // LOGIC STATUS PEMBAYARAN
    // =================================

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        console.log("Pembayaran berhasil (capture)");
        order.status = "paid";
      }
    } 
    else if (transactionStatus === "settlement") {
      console.log("Pembayaran berhasil (settlement)");
      order.status = "paid";
    } 
    else if (transactionStatus === "pending") {
      console.log("Menunggu pembayaran");
      order.status = "pending";
    } 
    else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      console.log("Pembayaran gagal");
      order.status = "failed";
    }

    await order.save();

    console.log("Order Updated:", orderId, order.status);
    console.log("Payment Type:", paymentType);

    // =================================
    // RESPONSE KE MIDTRANS
    // =================================
    res.status(200).json({
      message: "Notification handled",
      status: statusResponse
    });

  } catch (error) {

    console.error("Error handleNotification:", error);

    res.status(500).json({
      message: "Error handling notification"
    });

  }
};


// =================================
// MIDTRANS WEBHOOK
// =================================
router.post("/notification", handleNotification);


// =================================
// CEK STATUS ORDER
// =================================
router.get("/:order_id", async (req, res) => {
  try {

    const order = await Order.findOne({
      order_id: req.params.order_id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order tidak ditemukan",
      });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

export const checkStatus = async (req, res) => {
  try {

    const { orderId } = req.params;

    const statusResponse = await snap.transaction.status(orderId);

    res.status(200).json({
      order_id: statusResponse.order_id,
      transaction_status: statusResponse.transaction_status,
      payment_type: statusResponse.payment_type,
      fraud_status: statusResponse.fraud_status
    });

  } catch (error) {

    console.error("Error checkStatus:", error);

    res.status(500).json({
      message: "Gagal cek status transaksi"
    });

  }
};

export default router;