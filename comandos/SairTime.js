const Discord = require("discord.js");
const { Message, Guild } = require("discord.js");
const CP = require("../ControlPanel.json");

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff;
    var idTeamLeader = CP.idTeamLeader;

    const cargoAdm = message.guild.roles.cache.get(idStaff);
    const cargoTeamLeader = message.guild.roles.cache.get(idTeamLeader);

    try {
        //verificar se o author tem o cargo de adm ou de capitão para usar o comando
        const idAuthor = message.author.id;
        const author = message.guild.members.cache.get(idAuthor);

        if (args.length < 1) {
            message.channel.send(`**Digite o comando e em seguinda mencione o cargo do time! ex.: /Sairtime @cargoTime**`)
        } else {
            let cargoTime = message.mentions.roles.first();
            if (cargoTime != undefined) {
                let membro = message.guild.members.cache.get(message.author.id).roles;
                if (membro.cache.has(cargoTime.id)) {

                    let listaDeCargosIds = [CP.idTeamLeader, cargoTime.id]
                    let listaDePossibilidades = message.guild.members.cache.filter(d => d.roles.cache.has(listaDeCargosIds[0]));
                    let capitaoDoTime = listaDePossibilidades.filter(d => d.roles.cache.has(listaDeCargosIds[1]))

                    if (capitaoDoTime.array().length > 0) {
                        capitaoDoTime.array()[0].send(`O Player ${message.guild.members.cache.get(message.author.id).displayName} saiu do seu time ${cargoTime.name}!`)
                        
                    }
                    
                    membro.remove(cargoTime);
                    membro.remove(message.guild.roles.cache.get(CP.idCargoPlayer));
                    
                    message.channel.send(`**Você foi removido do time ${cargoTime.name}!**`);
                } else {
                    message.channel.send(`**Você não participa do time ${cargoTime.name}!**`);
                }             
            } else {
                message.channel.send(`**Digite o comando e em seguinda mencione o cargo do time! ex.: /Sairtime @cargoTime**`);
                
            }
        }
        let arquivocmd = bot.commands.get("logs");
        if (arquivocmd) arquivocmd.run(author, message, args);
    } catch (e) {
        message.channel.send("humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.")
    }
}

exports.help = {
    name: "sairtime"
}