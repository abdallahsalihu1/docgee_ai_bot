require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Check token
if (!process.env.BOT_TOKEN) {
  console.error("BOT_TOKEN is missing in .env file");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

console.log("🤖 DocGee Bot is running...");

// Helper function
function includesAny(text, keywords) {
  return keywords.some((word) => text.includes(word));
}

// Main response logic
function getBotResponse(text) {
  const msg = text.toLowerCase();

  // HEADACHE
  if (
    includesAny(msg, [
      "headache",
      "head dey pain",
      "my head hurts",
      "head is paining me",
      "migraine",
    ])
  ) {
    return "EN: You may have a headache. Rest, drink water, and take paracetamol.\n\nPIDGIN: You fit get headache. Rest small, drink water well and take paracetamol.\n\n⚠️ If it continues, see a doctor.";
  }

  // FEVER
  if (
    includesAny(msg, [
      "fever",
      "hot body",
      "body hot",
      "temperature",
      "i feel hot",
    ])
  ) {
    return "EN: You may have a fever. Drink plenty of water and rest.\n\nPIDGIN: Your body dey hot? Drink water well-well and rest.\n\n⚠️ If it gets worse, go to hospital.";
  }

  // COUGH
  if (
    includesAny(msg, [
      "cough",
      "coughing",
      "i dey cough",
      "dry cough",
    ])
  ) {
    return "EN: For cough, take warm water and avoid cold drinks.\n\nPIDGIN: If you dey cough, drink warm water and avoid cold things.\n\n⚠️ If it lasts long, see a doctor.";
  }

  // MALARIA
  if (
    includesAny(msg, [
      "malaria",
      "mosquito",
      "i feel weak",
      "body hot and headache",
    ])
  ) {
    return "EN: Malaria symptoms include fever, headache, and weakness.\n\nPIDGIN: Malaria fit make your body hot, head pain you, and make you weak.\n\n⚠️ Go for proper test and treatment.";
  }

  // STOMACH PAIN
  if (
    includesAny(msg, [
      "stomach",
      "belle pain",
      "stomach ache",
      "tummy pain",
    ])
  ) {
    return "EN: Stomach pain may be from food or infection. Avoid spicy food.\n\nPIDGIN: Belle pain fit come from food or infection. Avoid pepper.\n\n⚠️ If severe, go hospital.";
  }

  // BODY PAIN
  if (
    includesAny(msg, [
      "body pain",
      "my body hurts",
      "weak",
      "tired",
    ])
  ) {
    return "EN: Body pain may be due to stress or infection.\n\nPIDGIN: Body pain fit come from stress or sickness.\n\n⚠️ Rest well and monitor it.";
  }

  // EMERGENCY
  if (
    includesAny(msg, [
      "chest pain",
      "bleeding",
      "can't breathe",
      "cannot breathe",
    ])
  ) {
    return "🚨 EN: This is serious. Go to the hospital immediately.\n\n🚨 PIDGIN: This one serious o! Abeg go hospital sharp sharp!";
  }

  // DEFAULT
  return "EN: Sorry, I don't understand. Please explain better.\n\nPIDGIN: I no understand well. Abeg explain am better.\n\n⚠️ This is basic advice only.";
}

// ✅ START COMMAND (ONLY ONE RESPONSE)
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Hello! I be DocGee 🤖\n\nChoose a symptom below or type your own:",
    {
      reply_markup: {
        keyboard: [
          ["Headache 🤕", "Fever 🌡️"],
          ["Malaria 🦟", "Cough 😷"],
          ["Stomach Pain 🤢", "Body Pain 💪"],
        ],
        resize_keyboard: true,
      },
    }
  );
});

// ✅ MESSAGE HANDLER (NO DOUBLE REPLY)
bot.on("message", (msg) => {
  if (!msg.text) return;

  // 🚫 Prevent commands like /start from triggering twice
  if (msg.text.startsWith("/")) return;

  console.log("📩 Incoming:", msg.text);

  const chatId = msg.chat.id;

  try {
    const response = getBotResponse(msg.text);
    bot.sendMessage(chatId, response);
  } catch (error) {
    console.error("❌ Error:", error);
    bot.sendMessage(chatId, "⚠️ Something went wrong.");
  }
});

// Error handler
bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});