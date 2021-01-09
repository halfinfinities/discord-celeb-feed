const fs = require('fs');

require("dotenv").config();

const { Client } = require("discord.js");

const client = new Client();
const PREFIX = "$";
const DELAY_BETWEEN_IMAGES = 15000;

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {
    console.log(`The ${client.user.username} has logged in`);
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const setTimeoutPromise = timeout => new Promise(resolve => {        
    setTimeout(resolve, timeout);
});

const cleanChannel = async (channel) => {
    let fetched;
    do {
      fetched = await channel.messages.fetch({limit: 100});
      // for (let message of fetched) {
      //    message[1] && message[1].delete().then
      // }
      channel.bulkDelete(fetched);
    }
    while(fetched.size >= 2);
  }


const loadUrls = (channelName) => {
    try {
        const data = fs.readFileSync(`./${channelName}.txt`, 'UTF-8');
        const lines = data.split(/\r?\n/);
        return lines;
    } catch (err) {
        console.error(err);
    }
}

const urlMap = {};


const getRandomUrl = (channelName) => {
    if (!urlMap[channelName]) {
        urlMap[channelName] = loadUrls(channelName);
    }
    const lines = urlMap[channelName];
    if (!lines && !lines.length) return "";
    const url = lines[getRandomInt(lines.length)];
    return url;
}

const postImage = (message, channelName) => {
    message.channel.send(getRandomUrl(channelName));
}

let ongoingFeed = {};

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
        if (command == 'clean') {
            cleanChannel(message.channel);
        }

        if (command !== 'feed') return;
        if (ongoingFeed[channelName]) {
            message.channel.send(`${channelName} feed ongoing.`);
        } else {
            ongoingFeed[channelName] = true;
            const imagesToFeed = +args[0];
            if (imagesToFeed > 30) {
                message.channel.send("Maximum allowed images: 30. Streaming 30 images now");
                imagesToFeed = 30;
            }
            for (let i = 0; i < imagesToFeed; i++) {
                postImage(message, channelName);
                if (i !== imagesToFeed - 1) await setTimeoutPromise(DELAY_BETWEEN_IMAGES);
            }
            ongoingFeed[channelName] = false;
        }
            
    }
    console.log(`${authorTag} - ${content}`);
});









