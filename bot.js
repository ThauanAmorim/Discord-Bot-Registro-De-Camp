const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs")
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

fs.readdir("./comandos/", (err, files) => {
    if (err) console.error(err);

    let arquivojs = files.filter(f => f.split(".").pop() === "js");
    arquivojs.forEach((f, i) => {
        let props = require(`./comandos/${f}`);
        console.log(`O comando ${f} iniciou!`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("ready", () => {
    console.log("bot on");
    bot.user.setActivity("Youtube", {type: "STREAMING", url: "https://www.twitch.tv/thauanzin_", name : "Gameplay poha"})
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.prefix)) return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let arquivocmd = bot.commands.get(command.slice(prefix.length).toLowerCase());
    if (arquivocmd) arquivocmd.run(bot, message, args);

});

bot.login(config.token);