const axios = require('axios');
require("dotenv").config();

// Sends a high score email notification using Brevo API
async function posliHighscoreEmail(meno, skore) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Highscore Bot", email: process.env.EMAIL_FROM },
        to: [{ email: process.env.EMAIL_TO }],
        subject: "🎮 New Highscore!",
        textContent: `Congratulations! ${meno} just scored: ${skore}`
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Email sent:", response.data);
  } catch (error) {
    console.error("❌ Failed to send email:", error.response?.data || error.message);
  }
}

module.exports = { posliHighscoreEmail };
