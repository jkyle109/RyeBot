module.exports = {
    name: "addcommand",
    description: "Adds a custom command",
    args: true,
    execute(message, args){
        const commandName = args.shift();
        const regex = new RegExp(`${commandName} +`);
        const commandMessage = message.content.slice(process.env.PREFIX .length).split(regex, 2)[1];
        console.log(commandMessage, commandName)
    }
}