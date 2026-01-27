const { Bot } = require("grammy");
const { token } = require("./config");

// Экземпляр бота
const bot = new Bot(token);

// Объект для хранения данных пользователей
const users = {};

// Команда /start
bot.command("start", (ctx) => {
  ctx.reply("Добро пожаловать. Запущен и работает!");
});

// Обработка сообщений
bot.on("message", (ctx) => {
  const text = ctx.message.text;
  if (!text) {
    return ctx.reply("Пожалуйста, напиши текстом сообщение: «Купила линзы»");
  }

  const userId = ctx.from.id;

  if (text.toLowerCase().includes("купила линзы")) {
    users[userId] = { date: new Date(), reminded: false };
    return ctx.reply("Окей, записал. Напомню через 28 дней");
  }

  if (text.toLowerCase().includes("люблю тебя")) {
    return ctx.reply("Олег : Я тоже тебя очень сильно любит!");
  }

  ctx.reply("Сообщение получено, но я его пока не понимаю");
});

// Команда /check — проверка последней даты покупки
bot.command("check", (ctx) => {
  const user = users[ctx.from.id];
  if (user) {
    ctx.reply(`Твоя последняя покупка: ${user.date.toLocaleDateString()}`);
  } else {
    ctx.reply("Пока у меня нет информации о твоих покупках.");
  }
});

// Проверка напоминаний каждые 1 минуту (можно увеличить интервал)
setInterval(() => {
  const now = new Date();
  for (const userId in users) {
    const user = users[userId];
    if (!user.reminded) {
      const diffDays = (now - new Date(user.date)) / (1000 * 60 * 60 * 24);
      if (diffDays >= 28) {
        bot.api.sendMessage(userId, "Пора менять линзы!");
        user.reminded = true;
      }
    }
  }
}, 60 * 1000);

// Старт бота
bot.start({
  onStart: () => console.log("Бот запущен"),
});
