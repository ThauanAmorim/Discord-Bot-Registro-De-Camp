const Discord = require("discord.js");

exports.run = (bot, message, args) => {
    let dias = 0;
    let semanas = 0

    let uptime = "";
    let totalsegundo = (bot.uptime / 1000);
    let horas = Math.floor(totalsegundo / 3600);
    totalsegundo %= 3600;
    let minutos = (Math.floor(totalsegundo / 60));
    let segundo = (Math.floor(totalsegundo % 60));

    if (horas > 23) {
        dias += 1;
        horas = 0;
    }

    if (dias == 7) {
        semanas += 1;
        dias = 0;
    }

    if (semanas > 0) {
        uptime += `${semanas} semanas, `;
    }

    if (minutos > 60) {
        minutos = 0;
    }

    uptime += `** ${dias}d ${horas}h ${minutos}m ${segundo}s**`;

    message.channel.send(uptime);
}

exports.help = {
    name : "uptime"
}