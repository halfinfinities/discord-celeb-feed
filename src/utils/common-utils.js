exports.getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

exports.setTimeoutPromise = timeout => new Promise(resolve => {        
    setTimeout(resolve, timeout);
});
