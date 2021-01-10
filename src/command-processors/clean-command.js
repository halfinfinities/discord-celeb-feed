const cleanChannel = async (channel) => {
    let fetched;
    do {
        fetched = await channel.messages.fetch({ limit: 100 });
        channel.bulkDelete(fetched);
    }
    while (fetched.size >= 2);
}

exports.cleanChannel = cleanChannel;