const fs = require('fs');
const { getRandomInt } = require('./common-utils');

const urlMap = {};
let availableCelebs = [];

const loadUrls = (channelName) => {
    try {
        const data = fs.readFileSync(`./celebs/${channelName}.txt`, 'UTF-8');
        const lines = data.split(/\r?\n/);
        return lines;
    } catch (err) {
        console.error(err);
    }
}

const getRandomChannel = () => {
    if (availableCelebs.length === 0) {
        availableCelebs = fs.readdirSync('./celebs')
            .filter(fileName => fileName.endsWith('.txt'))
            .map(fileName => fileName.split('.').shift());
    }
    return availableCelebs[getRandomInt(availableCelebs.length)];
}

exports.getRandomUrl = (channelName) => {
    if (channelName === 'random') {
        channelName = getRandomChannel();
    }
    if (!urlMap[channelName]) {
        urlMap[channelName] = loadUrls(channelName);
    }
    const lines = urlMap[channelName];
    if (!lines && !lines.length) return "";
    const url = lines[getRandomInt(lines.length)];
    return url;
}
