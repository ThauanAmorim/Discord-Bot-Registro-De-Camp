const Discord = require("discord.js");
const { Message, Guild } = require("discord.js");
const CP = require("../ControlPanel.json")

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff;
    var idTeamLeader = CP.idTeamLeader;

    const cargoAdm = message.guild.roles.cache.get(idStaff);
    const cargoTeamLeader = message.guild.roles.cache.get(idTeamLeader);
    const cargoTeam = message.guild.roles.cache.find(r => r.id === (args[0].replace("<@&", "").replace(">", "")));

    try {
        if (message.channel.id === CP.chatBot) { 
            //verificar se o author tem o cargo de adm ou de capitão para usar o comando
            const idAuthor = message.author.id;
            const author = message.guild.members.cache.get(idAuthor);
    
            if (author.roles.cache.has(idStaff) || (author.roles.cache.has(idTeamLeader) && author.roles.cache.has(cargoTeam.id))) {
                if (args.length < 1) {
                    message.channel.send(`Digite o comando e em seguinda mencione os membros para remover o cargo ${cargoTeamLeader.name}! ex.: /RemoverCargo @cargo @membro1 @membro2 @membro3`)
                } else if (cargoTeam.id === cargoTeamLeader.id) {
                    message.channel.send(`Você não pode remover o cargo de ${cargoTeamLeader.name}`)
                } else {
                    var contadorDeMembrosRole = 0;
                    let lista = message.guild.roles.cache;
                    var cargo;
                    lista.forEach(element => {
                        if (element.name === cargoTeam.name) {
                            cargo = element
                            message.mentions.members.forEach(membro => {
                                let interval = setInterval(() => {
                                    membro.roles.remove(cargo);
                                    membro.roles.remove(message.guild.roles.cache.get(CP.idCargoPlayer));
                                    if (!(membro.roles.cache.some(role => role.id === cargo.id)) && !(membro.roles.cache.some(role => role.id === CP.idCargoPlayer))) {
                                        clearInterval(interval);
                                    }
                                }, 500);
                                
                                contadorDeMembrosRole++;
                            });
                        }
                    });
    
    
                    message.channel.send(`**Removendo o cargo ${cargoTeam.name} a ${contadorDeMembrosRole} membros!**`)
                }
            } else {
                message.channel.send(`Para remover o cargo ${cargoTeam.name} você deve ter o cargo do time!`)
            }
            let arquivocmd = bot.commands.get("logs");
            if (arquivocmd) arquivocmd.run(author, message, args);
        } else {
            message.channel.send("Bot não pode ser usado nesse chat")
        }
    } catch (e) {
        message.channel.send("humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.")
    }
}

exports.help = {
    name: "removercargo"
}