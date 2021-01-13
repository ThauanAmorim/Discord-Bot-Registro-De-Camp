const Discord = require("discord.js");
const { Message, Guild } = require("discord.js");
const CP = require("../ControlPanel.json");

exports.run = (author, message = new Message, args) => {
    try {
        var textoSaida = `${author.displayName} usou o comando ${message.content.split(" ")[0]} `;

        args.forEach(element => {
            if ((element.indexOf("<@&")) != -1) {
                let role = message.guild.roles.cache.get(element.replace("<@&", "").replace(">", ""))
                textoSaida += `<@&${role.id}> (${role.name}) `
            } else if ((element.indexOf("<@")) != -1) {
                let member = message.guild.members.cache.get(element.replace("<@", "").replace(">", "").replace("!", ""))
                textoSaida += `<@${member.id}>(${member.displayName}) `
            } else {
                textoSaida += `${element} `
            }
        });
        message.guild.channels.cache.get(CP.idChatLogs).send(`${textoSaida}`)
            
    } catch (e) {
    }
}

exports.help = {
    name: "logs"
}