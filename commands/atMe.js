module.exports = {
    name: "atMe",
    description: "Replies by mentioning the user.",
    execute(message, args){
        const authorId = message.author.id;
        // message.reply("You called?");
        message.channel.send(`<@${authorId}> You called?`);
    }
}