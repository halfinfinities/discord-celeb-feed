const { cleanChannel } = require("./clean-command");
const { feed } = require("./feed-command");
const { dm } = require("./dm-command");

exports.cleanChannel = cleanChannel;
exports.feed = feed;
exports.dm = dm;