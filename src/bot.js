const { Client } = require("discord.js");
const { cleanChannel, feed, dm } = require('./command-processors');



const client = new Client();
const PREFIX = "$";

require("dotenv").config();
const totalRequestsMade = {};

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {
    console.log(`${client.user.username} has logged in`);
});


client.on('message', async (message) => {
    if (message.author.bot) return;
    const content = message.content;
    const authorTag = message.author.tag;
    const channelName = message.channel.name;
    if (content.startsWith(PREFIX)) {
        const [command, ...args] = content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        const numberOfImages = +args[0];
        if (command == 'clean') {
            cleanChannel(message.channel);
        } else if (command == 'feed') {
            if (isNaN(args[0])) {
                message.channel.send('You need to enter the number of images you need. Command: $feed number');
                return;
            }
            feed(message.channel, numberOfImages);
        } else if (command == 'dm') {
            if (isNaN(args[0])) {
                message.channel.send('You need to enter the number of images you need. Command: $feed number');
                return;
            }
            
            dm(message.author, channelName, numberOfImages, 'start');
        } else if (command === 'stop') {
            if (message.channel.type === 'dm') {
                dm(message.author, channelName, numberOfImages, 'stop');
            } else {
                message.channel.send('Don\'t worry about stopping channel feeds. The $stop command is needed only when the bot is DM\'ing you a feed');
            }

        }

    }
    console.log(`${authorTag} - ${content}`);
});


/*
setInterval(
    () => {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    },
    1200000
);

*/



