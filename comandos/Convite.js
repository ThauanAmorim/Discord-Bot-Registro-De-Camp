const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = (bot, message, args) => {
    const avatarURL = message.client.users.cache.get("184734590148018176").avatarURL();
    const embed = new MessageEmbed()
        .setTitle('PUBG COMMUNITY LINK')
        .setColor(299177)
        .setDescription('https://discord.me/pubgcm')

    message.channel.send(embed)
}

exports.help = {
    name: "convite"
}