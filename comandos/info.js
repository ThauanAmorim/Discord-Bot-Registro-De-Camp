const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = (bot, message, args) => {
    const avatarURL = message.client.users.cache.get("184734590148018176").avatarURL();
    const embed = new MessageEmbed() 
        .setTitle('PUBG COMMUNITY BOT')
        .setColor(299177)
        .setDescription('Bot criado para auxilio do registro de camps / customs !!')
        .setFooter("Bot criado por: Thauanzin", avatarURL)

    message.channel.send(embed)
}

exports.help = {
    name: "info"
}