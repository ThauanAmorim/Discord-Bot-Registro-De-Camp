const Discord = require("discord.js");
const { Message, Guild } = require("discord.js");
const CP = require("../ControlPanel.json")

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff;
    var idTeamLeader = CP.idTeamLeader;

    const cargoAdm = message.guild.roles.cache.get(idStaff);
    const cargoTeamLeader = message.guild.roles.cache.get(idTeamLeader);

    try {
        //verificar se o author tem o cargo de adm ou de capitão para usar o comando
        const idAuthor = message.author.id;
        const author = message.guild.members.cache.get(idAuthor);

        if (author.roles.cache.has(idStaff)) {
            if (args.length < 1) {
                message.channel.send(`Digite o comando e em seguinda mencione os membros para receber o cargo ${cargoTeamLeader.name}! ex.: /DeletarCapitao @membro1 @membro2 @membro3`)
            } else {
                var contadorDeMembrosRole = 0;
                let lista = message.guild.roles.cache;
                var cargo;
                lista.forEach(element => {
                    if (element.name === cargoTeamLeader.name) {
                        cargo = element
                        message.mentions.members.forEach(membro => {
                            membro.roles.remove(cargo);
                            contadorDeMembrosRole++;
                        });
                    }
                });


                message.channel.send(`**Adicionado o cargo ${cargoTeamLeader.name} a ${contadorDeMembrosRole} membros!**`)
            }
        } else {
            message.channel.send(`Para adicionar o cargo de ${cargoTeamLeader.name} você deve ter o cargo de ${cargoAdm.name}!`)
        }
        let arquivocmd = bot.commands.get("logs");
        if (arquivocmd) arquivocmd.run(author, message, args);
    } catch (e) {
        message.channel.send("humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.")
    }
}

exports.help = {
    name: "removercapitao"
}