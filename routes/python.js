import axios from "axios";
import { Router } from "express";

const router = Router();

router.get("/analisa-data", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/analisa-data");

    console.log("Response dari server:");
    console.log(response.data);

    res.send(response.data);

  } catch (error) {
    console.error("Terjadi error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;