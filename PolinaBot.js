const { Bot } = require("grammy");
const cron = require("node-cron")
const token = require("./config.js")

const bot = new Bot(token);

const users = {}

// /start
bot.command("start", (ctx) => {
  ctx.reply("Добро пожаловать. Запущен и работает!");
});



// сообщения
bot.on("message", (ctx) => {
  const text = ctx.message.text;

  if (!text) {
    return ctx.reply("Пожалуйста, напиши текстом сообщение: «Купила линзы»");
  }

  if (text.toLowerCase().includes("купила линзы")) {
    const userId = ctx.from.id; 
    users[userId] = {date: new Date() , reminded : false}
    return ctx.reply("Окей, записал. Напомню через 28 дней");
  }

if (text.toLowerCase().includes("люблю тебя")) {
  return ctx.reply("Олег тоже тебя очень сильно любит!");
}

  ctx.reply("Сообщение получено, но я его пока не понимаю");
});

bot.command("check", (ctx) => {
  const userId = ctx.from.id;
  const date = users[userId];
  if (date) {
    ctx.reply(`Твоя последняя покупка: ${date.toLocaleDateString()}`);
  } else {
    ctx.reply("Пока у меня нет информации о твоих покупках.");
  }
});

setInterval(() => {
  const now = new Date();
  for (const userId in users) {
    const user = users[userId];
    if (!user.reminded) {
      const diff = now - user.date; //
      const days = diff / (1000 * 60 * 60 * 24);
      if (days >= 28) {
        bot.api.sendMessage(userId, "Пора менять линзы!");
        user.reminded = true;
      }
    }
  }
}, 60 * 1000);

bot.start({
  onStart: () => {
    console.log("Бот запущен");
  },
});