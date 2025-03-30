const axios = require("axios");
require("dotenv").config();

async function posliHighscoreEmail(meno, skore) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Highscore Bot", email: process.env.EMAIL_FROM },
        to: [{ email: process.env.EMAIL_TO }],
        subject: "🎮 Nový Highscore!",
        textContent: `Gratulujeme! ${meno} práve dosiahol skóre: ${skore}`
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Email odoslaný:", response.data);
  } catch (error) {
    console.error("❌ Chyba pri odoslaní emailu:", error.response?.data || error.message);
  }
}

module.exports = { posliHighscoreEmail };
