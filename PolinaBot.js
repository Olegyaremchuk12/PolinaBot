const { Bot, Keyboard } = require("grammy");
const { token } = require("./config");

// Экземпляр бота
const bot = new Bot(token);

// Объект для хранения данных пользователей
const users = {};

// Клавиатура для кнопок
const mainKeyboard = new Keyboard()
  .text("Купила линзы")
  .text("Люблю тебя");

// Команда /start
bot.command("start", (ctx) => {
  ctx.reply(
    "Добро пожаловать! Выбери действие кнопкой ниже:",
    { reply_markup: mainKeyboard }
  );
});

// Обработка сообщений через кнопки
bot.on("message", (ctx) => {
  const text = ctx.message.text;
  const userId = ctx.from.id;

  if (text === "Купила линзы") {
    users[userId] = {
      date: new Date(),
      reminded: false,
    };

    return ctx.reply("Окей, записал. Напомню через 28 дней", {
      reply_markup: mainKeyboard,
    });
  }

  if (text === "Люблю тебя") {
    return ctx.reply("Олег тоже тебя очень сильно любит!", {
      reply_markup: mainKeyboard,
    });
  }

  ctx.reply("Пожалуйста, используй кнопки ниже:", {
    reply_markup: mainKeyboard,
  });
});

// Команда /check
bot.command("check", (ctx) => {
  const user = users[ctx.from.id];
  if (user) {
    ctx.reply(`Твоя последняя покупка: ${user.date.toLocaleDateString()}`);
  } else {
    ctx.reply("Пока у меня нет информации о твоих покупках.");
  }
});

// Напоминание через 28 дней (линзы)
setInterval(() => {
  const now = new Date();

  for (const userId in users) {
    const user = users[userId];

    if (!user.reminded) {
      const diffDays =
        (now - new Date(user.date)) / (1000 * 60 * 60 * 24);

      if (diffDays >= 28) {
        bot.api.sendMessage(userId, "Пора менять линзы!");
        user.reminded = true;
      }
    }
  }
}, 60 * 1000);

// Напоминание раз в 4 дня (просто пока бот запущен)
const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;

setInterval(() => {
  for (const userId in users) {
    bot.api.sendMessage(
      userId,
      "Напоминание: купить вкусняшки Олегу!"
    );
  }
}, FOUR_DAYS);

// Старт бота
bot.start({
  onStart: () => console.log("Бот запущен"),
});
