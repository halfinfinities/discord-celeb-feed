const { Client } = require("discord.js");
const { cleanChannel, feed } = require('./command-processors');



const client = new Client();
const PREFIX = "$";

require("dotenv").config();


client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {
    console.log(`${client.user.username} has logged in`);
});


client.on('message', async (message) => {
    if (message.author.bot) return;
    const content = message.content;
    const authorTag = message.author.tag;
    
    if (content.startsWith(PREFIX)) {
        const [command, ...args] = content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        const numberOfImages = +args[0];
        if (command == 'clean') {
            cleanChannel(message.channel);
        } else if (command == 'feed') {
            feed(message.channel, numberOfImages);
        }
    }
    console.log(`${authorTag} - ${content}`);
});









