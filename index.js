const fs = require("fs");
const Discord = require("discord.js");

require("dotenv").config();

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

const prefix = process.env.PREFIX;
const token = process.env.TOKEN;

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
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
    // load_db_commands();
    console.log("Ready!");
});

function genRand(min, max){
    return Math.floor(Math.random()*(max-min+1)) + min
}


client.on("message", (message) => {
    if(message.author.bot){
        return
    }

    if(message.author.tag == "kylus#2238"){
        if(message.content.toLowerCase().includes("not behind")){
            message.reply("You're behind bro!")
        } 
        else if(message.content.toLowerCase().includes("behind")){
            message.reply("You're not behind!")
        }
    }
    else{
        if(message.content.toLowerCase().includes("behind")){
            if(genRand(0,99)%2 == 0){
                message.reply("You might be behind, lol <:pepeLaugh:668310019703439381>")
            }
            else{
                message.reply("You're not behind <:EZ:756353626032570448>")
            }
            
        }
    }





    if(!message.content.startsWith(prefix) || message.author.bot || message.content.slice(prefix.length).length === 0){
        return;
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log(commandName)


    if(commandName == "ping"){
        message.reply("pong")
    }
































    // if(commandName.toLowerCase() === "addcommand" && args.length>=2){
    //     if(!args>=2){
    //         message.reply("Not enough arguments provided.");
    //         return;
    //     }
    //     const commandName = args.shift();
    //     const commandMessage = message.content.slice(process.env.PREFIX .length).split(commandName, 2)[1];
    //     console.log("???? " + commandName + " " + commandMessage)
    //     const query = `INSERT INTO custom_commands (command_name, command_message) VALUES ($$${commandName}$$, $$${commandMessage}$$)`;
    //     console.log(query)
    //     db.query(query, (err, res) => {
    //         if(err){
    //             throw err;
    //         }
    //         message.reply(`The command "${prefix}${commandName}" has been added.`);
    //         load_db_commands();
    //     })
    //     return;
    // }


    // let command;
    // if(!client.commands.has(commandName)){
    //     if(!commandName in db_commands){
    //         return;
    //     } else {
    //         args[0] = db_commands[commandName].command_message;
    //         command = client.commands.get("customMessage");
    //     }
    // } else {
    //     command = client.commands.get(commandName);
    // }

    // if(command.args && !args.length) {  // Command requires args but user did not provide any
    //     message.reply("There were no arguments provided.");
    //     return;
    // }

    // try{
    //     command.execute(message, args);
    // } catch(error) {
    //     console.log(error);
    //     message.reply("Error with this command.");
    // }
});

client.login(token);