const { getRandomUrl } = require('../utils/url-utils');
const { setTimeoutPromise } = require('../utils/common-utils');

let ongoingFeed = {};
const MAX_IMAGES_PER_FEED = 30;
const DELAY_BETWEEN_IMAGES = 20000;
const MAX_FEED_PER_DAY = 10;
let totalRequests = {};

exports.dm = async (user, channelName, numberOfImages, action) => {
    const userId = user.id;
    if (action === 'stop') {
        ongoingFeed[userId] = 'cancel';
        user.send('Canceling feed...');
        return;
    }
    if (ongoingFeed[userId]) {
        user.send(`I'm still feeding you your last request`);
        user.send(`Wait for this to finish or DM me $stop before requesting a new one.`);
    } else {
        ongoingFeed[userId] = true;
        let requestsSoFar = totalRequests[userId] || 0;
        if (requestsSoFar > MAX_FEED_PER_DAY) {
            user.send(`This is an intervention! You've made ${MAX_FEED_PER_DAY} requests in the last 24 hours. Stop using this bot and go outside, maybe? See you in a day!`);
            return;
        }
        totalRequests[userId] = ++requestsSoFar;
        if (numberOfImages > MAX_IMAGES_PER_FEED) {
            user.send(`Maximum allowed images: ${MAX_IMAGES_PER_FEED}. Streaming ${MAX_IMAGES_PER_FEED} images now`);
            numberOfImages = MAX_IMAGES_PER_FEED;
        }
        user.send(`Starting ${channelName} feed of ${numberOfImages} images.`);
        user.send(`Type $stop here to stop this feed anytime.`);
        for (let i = 0; i < numberOfImages; i++) {
            if (ongoingFeed[userId] === 'cancel') break;
            let imageUrl = getRandomUrl(channelName);
            user.send(imageUrl);
            console.log(`Fed ${user.tag}`);
            if (i !== numberOfImages - 1) await setTimeoutPromise(DELAY_BETWEEN_IMAGES);
        }
        if (ongoingFeed[userId] === 'cancel') {
            user.send(`Feed canceled`);
        } else if (ongoingFeed[userId]) {
            user.send(`${numberOfImages} image feed complete`);
        } 
        ongoingFeed[userId] = false;
    }
}