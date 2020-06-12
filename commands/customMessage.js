module.exports = {
    name: "customMessage",
    description: "Prints a custom message or messages!",
    args: true,
    execute(message, args){
        for(let line of args){
            message.channel.send(line);
        }
    },
};