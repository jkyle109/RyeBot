module.exports = {
    name: "ping",
    description: "Replies with pong.",
    args: false,
    execute(message, args){
        message.channel.send("pong.");
    },
};