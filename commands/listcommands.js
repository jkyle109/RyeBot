module.exports = {
    name: "listcommands",
    description: "Lists all custom commands",
    args: false,
    execute(message, args, client, db, db_commands){
        const Discord = require("discord.js");
        let commandList = ""
        for(command in db_commands){
            commandList = commandList + command + "\n"
        }
        const embed = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setColor(0xff0000)
            .addFields({
                name: "\u200bCurrent custom commands:",
                value: commandList,
                inline: true
            })
            .setTimestamp()
        message.channel.send(embed)
    }
}