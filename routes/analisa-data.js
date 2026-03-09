import axios from "axios";

async function analisaData() {
  try {
    const response = await axios.get("http://localhost:5000/analisa-data");

    console.log("Response dari server:");
    console.log(response.data);

  } catch (error) {
    console.error("Terjadi error:", error.message);
  }
}

analisaData();