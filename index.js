const TelegramBot = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options.js');

const TOKEN = '6173965831:AAGk8AMbvp1t-LVasoGWRPSvRFfI38L4EqI';

const bot = new TelegramBot(TOKEN, {polling: true});

bot.setMyCommands([
    {command: '/start', description: 'Начальное состояние бота'},
    {command: '/info', description: 'Информация о Telegram-боте TON NFT Monitor'},
    {command: '/game', description: 'Мини-игра (для тренировки) УДАЛИТЬ'}
]);

const chats = [];

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать! Введи цифру)`);
    chats[chatId] = String(Math.floor(Math.random() * 10));
    await bot.sendMessage(chatId, `Загадал...Отгадывай!`, gameOptions);
}

const start = async () => {
    bot.on('message',async (message) => {
        const text = message.text;
        const chatId = message.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/2.webp')
            return  bot.sendMessage(
                chatId,
                `Привет!\n\nРады приветствовать тебя в TON Monitor BOT!\n\nДанный бот помогает отслеживать актуальную информацию по номерам и никнеймам в Telegram на различных криптобиржах - с ним ты можешь принимать выгодные решения в самое короткое время!`);
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Привет, ${message.from.first_name} ${message.from.last_name}!`)
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, `Извини,не понял тебя! Отправь, пожалуйста, другую команду...`);
    });

    bot.on('callback_query',  async (message) => {
        const data = message.data;
        const chatId = message.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return  bot.sendMessage(chatId, `Угадал! Поздравляю!`, againOptions);
        } else {
            return  bot.sendMessage(chatId, `Не угадал...Я загадывал ${chats[chatId]}`, againOptions);
        }
    });
}

start();



