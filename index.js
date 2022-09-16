const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5657323748:AAFvTFXoIqWXuBCnpSv-miXSsggbPHq3aWM";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Сейчас я загадую цифру от 0 до 10, попробуй её угадать");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить данные о пользователе" },
    { command: "/game", description: "Игра угадай число" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(chatId, "https://www.freeiconspng.com/thumbs/cat-icon/cat-icon-25.png");
      return bot.sendMessage(chatId, "Добро пожаловать в бот тест БМ");
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Ваше имя ${msg.from.first_name} и фамилия ${msg.from.last_name}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю");
  });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю ты угадал цифру: ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `К сожалению ты не угадал цифру: ${chats[chatId]}`, againOptions);
    }
  });
};

start();
