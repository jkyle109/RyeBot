module.exports = {
    name: "ping",
    description: "Replies with pong.",
    args: false,
    execute(message){
        message.channel.send("pong.");
    },
};