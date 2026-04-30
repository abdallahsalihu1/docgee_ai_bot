const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ========================
// 🌐 WEB ROUTE
// ========================
app.get("/", (req, res) => {
  res.send("Backend is working");
});

// ========================
// 🧠 Helper function
// ========================
function includesAny(text, keywords) {
  return keywords.some((word) => text.includes(word));
}

// ========================
// 🤖 BOT LOGIC (shared)
// ========================
function getBotResponse(text) {
  if (!text) {
    return {
      en: "No message received.",
      pidgin: "I no receive any message.",
    };
  }

  const msg = text.toLowerCase();

  if (includesAny(msg, ["headache", "head dey pain", "migraine"])) {
    return {
      en: "You may have a headache. Rest, drink water, and you can take paracetamol. ⚠️ See a doctor if severe.",
      pidgin: "You fit get headache. Rest small, drink water, take paracetamol. ⚠️ If e strong, go hospital.",
    };
  }

  if (includesAny(msg, ["fever", "body hot", "temperature"])) {
    return {
      en: "You may have fever. Drink water and rest. ⚠️ See a doctor if it lasts.",
      pidgin: "Body dey hot? Drink water, rest. ⚠️ If e continue, go hospital.",
    };
  }

  if (includesAny(msg, ["cough", "i dey cough"])) {
    return {
      en: "Drink warm water and avoid cold drinks. ⚠️ See a doctor if it persists.",
      pidgin: "Drink warm water, avoid cold things. ⚠️ If e no stop, go hospital.",
    };
  }

  if (includesAny(msg, ["malaria", "mosquito"])) {
    return {
      en: "Go for malaria test and take ACT drugs if confirmed.",
      pidgin: "Go test malaria, dem dey use ACT treat am.",
    };
  }

  if (includesAny(msg, ["stomach", "belle pain"])) {
    return {
      en: "Avoid spicy food and take antacid if needed.",
      pidgin: "Avoid pepper food, you fit take antacid.",
    };
  }

  return {
    en: "Sorry, I don't understand your symptom.",
    pidgin: "I no understand well, abeg explain better.",
  };
}

// ========================
// 💬 WEB CHAT ROUTE
// ========================
app.post("/chat", (req, res) => {
  const userMessage = req.body.message;
  const reply = getBotResponse(userMessage);

  res.json({ reply });
});

// ========================
// 🤖 TELEGRAM BOT SETUP
// ========================

const TOKEN = process.env.TELEGRAM_TOKEN; // put in Render env
const BASE_URL = process.env.BASE_URL; // e.g https://your-app.onrender.com

let bot;

if (TOKEN && BASE_URL) {
  bot = new TelegramBot(TOKEN);

  // Set webhook (important for Render/Vercel)
  bot.setWebHook($`{BASE_URL}/telegram`);

  console.log("Telegram bot webhook set:", `${BASE_URL}/telegram`);
}

// Telegram webhook endpoint
app.post("/telegram", (req, res) => {
  if (!bot) return res.sendStatus(200);

  const message = req.body.message;

  if (!message || !message.text) return res.sendStatus(200);

  const chatId = message.chat.id;
  const userText = message.text;

  const reply = getBotResponse(userText);

  const finalReply = `EN: ${reply.en}\n\nPIDGIN: ${reply.pidgin}`;

  bot.sendMessage(chatId, finalReply);

  res.sendStatus(200);
});

// ========================
// 🚀 START SERVER
// ========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});