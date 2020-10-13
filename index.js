const fs = require("fs");
const Discord = require("discord.js");



require("dotenv").config();

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));     // Reads command folder for commands files

const prefix = process.env.PREFIX;
const token = process.env.TOKEN;
const ownerID = process.env.BOT_OWNER;

const kyleVid = process.env.KYLE_VID;
const igor = process.env.IGOR;

for(const file of commandFiles){
    const command = require(`./commands/${file}`);      //Imports the command modules
    client.commands.set(command.name, command);         
}


// db setup 
const pg = require("pg");
const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


let db_commands = {};

function load_db_commands(){
    db.query("SELECT * FROM custom_commands;", (err, res) => {
        if(err){
            throw err;
        }
        
        db_commands = {}

        for(let row of res.rows){
            let command = JSON.parse(JSON.stringify(row));
            db_commands[command.command_name] = command;
        }
    })
}


client.on("ready", () => {
    db.connect();
    load_db_commands()
    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: "anime...",
            type: "WATCHING",
        }
    })
    client.users.cache.get(ownerID).send("Ready!")
    console.log("Ready!")
});

function genRand(min, max){
    return Math.floor(Math.random()*(max-min+1)) + min
}


client.on("message", (message) => {
    // console.log(db_commands)
    // console.log(client.commands)
    if(message.author.bot){
        return
    }

    if(message.content.toLowerCase().includes("lowerky") || message.content.toLowerCase().includes("lowerkey") || message.content.toLowerCase().includes("low key")){
        message.delete()
    }

    if(message.author.tag == "Captain Save a Hoe#6969"){
        message.reply("How are you so handsome?",{files: [igor]})
        return
    }

    if(message.author.tag == "kylus#2238"){
        // if(message.content.toLowerCase().includes("not behind")){
        //     message.reply("You're behind bro!")
        //     return;
        // } 
        if(message.content.toLowerCase().includes("behind")){
            message.reply("You're not behind!")
            return;
        }
    }
    else{
        if(message.content.toLowerCase().includes("behind")){
            if(genRand(1,100)%4 == 0){
                if(genRand(1,20)%4 == 0){
                    message.reply({files: [kyleVid]})
                    return;
                }
                message.reply("You might be behind, lol <:pepeLaugh:668310019703439381>")
                return;
            }
            else{
                message.reply("You're not behind <:EZ:756353626032570448>")
                return;
            }
        }
    }

    if(message.channel.type != "dm" && message.content.toLowerCase().includes(message.guild.roles.everyone.toString())){
        message.channel.send("<:AngryPing:755244083953270905>")
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username)
            .setTitle("From: " + message.guild.name + "\nIn: #" + message.channel.name)
            .setColor(0xff6000)
            .setDescription(message.content)
            .setTimestamp()
        client.users.cache.get(ownerID).send(embed)
        return;
    }

    if(message.channel.type == "dm"){
        const embed = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setColor(0xff0000)
            .setDescription(message.content)
            .setTimestamp()
        client.users.cache.get(ownerID).send(embed)
        return;
    }


    if(!message.content.startsWith(prefix) || message.author.bot || message.content.slice(prefix.length).length === 0){
        return;
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift();

    console.log(commandName)


    let command;
    load_db_commands();
    // TODO: Make this into a function that loops so we can add aliases
    if(!client.commands.has(commandName)){  // Checks for client commands
        if(!(commandName in db_commands)){  // Checks for database commands
            return;
        } else {
            args[0] = db_commands[commandName].command_message;
            command = client.commands.get("customMessage");
        }
    } else {
        command = client.commands.get(commandName);
    }

    if(command.args && !args.length) {  // Command requires args but user did not provide any
        message.reply("There were no arguments provided.");
        return;
    }

    try{
        command.execute(message, args, client, db, db_commands);    // Executes command 
        load_db_commands();
    } catch(error) {
        console.log(error);
        message.reply("Error with this command.");
    }
});

client.login(token);