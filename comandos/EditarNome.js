const Discord = require("discord.js");
const { Message, Guild } = require("discord.js");
const CP = require("../ControlPanel.json");

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff;
    var idTeamLeader = CP.idTeamLeader;

    const cargoTeam = message.guild.roles.cache.find(r => r.id === message.mentions.roles.first().id);

    try {
        if (message.channel.id === CP.chatBot) { 
            //verificar se o author tem o cargo de adm ou de capitão para usar o comando
            const idAuthor = message.author.id;
            const author = message.guild.members.cache.get(idAuthor);
    
            if (author.roles.cache.has(idStaff) || (author.roles.cache.has(idTeamLeader) && author.roles.cache.has(idTeamLeader))) {
                if (args.length < 1) {
                    message.channel.send(`**Digite o comando e em seguida mencione o cargo do seu time e logo apos digite o novo nome! ex.: /EditarNome @cargoTime NovoNome**`)
                } else if ((args[0].indexOf("<@&") == -1)) {
                    message.channel.send(`**Voce deve mencionar o cargo ${args[0]} e depois digitar o novo nome`)
                } else if (message.guild.roles.cache.get((args[0].replace("<@&", "").replace(">", ""))).name === args[1]) {
                    message.channel.send("**Voce está tentando alterar o nome do time pelo mesmo nome**")
                }else if (message.guild.roles.cache.find(r => r.name === args[1])) {
                    message.channel.send("**Ja existe um time com esse nome!**")
                } else {
                    var nomeAntigo = cargoTeam.name;
                    cargoTeam.setName(args[1]);
    
                    message.channel.send(`**O Time ${nomeAntigo} agora chama-se ${args[1]}**`);
    
                    message.guild.channels.cache.forEach(element => {
                        let channel = element;
                        if (element.name === nomeAntigo) {
                            channel.setName(args[1]);
                        }
                    });
                }
            } else {
                message.channel.send(`**Para Alterar o nome do time ${cargoTeam.name} você deve fazer parte dele!**`)
            }
            let arquivocmd = bot.commands.get("logs");
            if (arquivocmd) arquivocmd.run(author, message, args);
        } else {
            message.channel.send("Bot não pode ser usado nesse chat")
        }
    } catch (e) {
        message.channel.send("**humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.**")
    }
}

exports.help = {
    name: "editarnome"
}