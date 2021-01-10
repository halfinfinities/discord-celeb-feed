const { getRandomUrl } = require('../utils/url-utils');
const { setTimeoutPromise } = require('../utils/common-utils');

let ongoingFeed = {};
const MAX_IMAGES_PER_FEED = 30;
const DELAY_BETWEEN_IMAGES = 15000;

exports.feed = async (channel, numberOfImages) => {
    const channelName = channel.name;
    if (ongoingFeed[channelName]) {
        channel.send(`${channelName} feed ongoing.`);
    } else {
        ongoingFeed[channelName] = true;
        if (numberOfImages > MAX_IMAGES_PER_FEED) {
            channel.send(`Maximum allowed images: ${MAX_IMAGES_PER_FEED}. Streaming ${MAX_IMAGES_PER_FEED} images now`);
            numberOfImages = MAX_IMAGES_PER_FEED;
        }
        for (let i = 0; i < numberOfImages; i++) {
            let imageUrl = getRandomUrl(channelName);
            channel.send(imageUrl);
            if (i !== numberOfImages - 1) await setTimeoutPromise(DELAY_BETWEEN_IMAGES);
        }
        ongoingFeed[channelName] = false;
    }
}