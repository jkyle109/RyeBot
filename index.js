const fs = require("fs");
const Discord = require("discord.js");
const client = Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

const config = require("./config");
const prefix = process.env.prefix || config.prefix;
const token = process.env.token || config.token;

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log("Ready!");
});

client.on("message", (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot){
        return;
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift();

    if(!client.commands.has(commandName)){
        return;
    }
    const command = client.commands.get(command);
    if(command.args && !args.length) {  // Command requires args but user did not provide any
        message.reply("There were no arguments provided.");
        return;
    }

    try{
        command.execute(message, args);
    } catch(error) {
        console.log(error);
        message.reply("Error with this command.");
    }
});