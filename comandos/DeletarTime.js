const Discord = require("discord.js");
const { Message, Guild } = require("discord.js");
const CP = require("../ControlPanel.json");

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff
    var idTeamLeader = CP.idTeamLeader;

    const cargoAdm = message.guild.roles.cache.get(idStaff);
    const cargoTeamLeader = message.guild.roles.cache.get(idTeamLeader);
    const cargoteam = message.guild.roles.cache.get((args[0].replace("<@&", "").replace(">", "")))

    try {
        if (message.channel.id === CP.chatBot) { 
            //verificar se o author tem o cargo de adm ou de capitão para usar o comando
            const idAuthor = message.author.id;
            const author = message.guild.members.cache.get(idAuthor);
    
            if (author.roles.cache.has(idStaff) || (author.roles.cache.has(idTeamLeader) && author.roles.cache.has(idTeamLeader))) {
                if (args.length < 1) {
                    message.channel.send("Digite o comando e em seguinda mencione o cargo do time que deseja deletar! ex.: /DeletarTime @CargoTime")
                } else if (args[0].indexOf("<@&") === -1) {
                    message.channel.send("Você deve mencioncar o cargo do Time! ex.: /DeletarTime @CargoTime1")
                } else {
                    let role = message.guild.roles.cache.find(r => r.name === cargoteam.name);
                    var contadorDeMembrosRole = 0;
                    role.members.forEach(element => {
                        contadorDeMembrosRole++;
                    });
                    

                    var msg = await message.channel.send(`**Deseja que seu cargo de ${cargoTeamLeader.name} seja removido?**`);
                    msg.react('✅').then(() => msg.react('❌'));

                    const filter = (reaction, user) => {
                        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };
                    msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === '✅') {
                                msg.edit(`**Time e cargo de ${cargoTeamLeader.name} removido com sucesso, removido o cargo de ${contadorDeMembrosRole} membros!**`).then(msg => {

                                    let listaDeMembros = message.guild.members.cache.filter(m => m.roles.cache.has(cargoteam.id));
                                    listaDeMembros.forEach(element => {
                                        let interval = setInterval(() => {
                                            element.roles.remove(CP.idCargoPlayer);
                                            if (!(element.roles.cache.has(CP.idCargoPlayer))) {
                                                clearInterval(interval);
                                            }
                                        }, 500);
                                    });

                                    role.delete();
                                    message.guild.channels.cache.find(c => c.name === cargoteam.name).delete();
                                    author.roles.remove(idTeamLeader);
                                })
                                    .catch(console.error);
                                
                            } else {
                                let listaDeMembros = message.guild.members.cache.filter(m => m.roles.cache.has(cargoteam.id));
                                listaDeMembros.forEach(element => {
                                    let interval = setInterval(() => {
                                        element.roles.remove(CP.idCargoPlayer);
                                        if (!(element.roles.cache.has(CP.idCargoPlayer))) {
                                            clearInterval(interval);
                                        }
                                    }, 500);
                                    
                                });

                                role.delete();
                                message.guild.channels.cache.find(c => c.name === cargoteam.name).delete();
                                msg.edit(`**Time deletado com sucesso, seu cargo de ${cargoTeamLeader.name} foi preservado, removido o cargo de ${contadorDeMembrosRole} membros!**`)
                                
                            }
                        })
                        .catch(collected => {
                            message.reply('**Demorou em responder os reacts, por isso o time não foi deletado!**')
                            
                        });
                }
            } else {
                message.channel.send(`**Para deletar o time você precisa ter o cargo ${cargoTeamLeader.name} junto com o cargo ${cargoteam.name}**`)
            }
            let arquivocmd = bot.commands.get("logs");
            if (arquivocmd) arquivocmd.run(author, message, args);
        } else {
            message.channel.send("**Bot não pode ser usado nesse chat**")
        }
    } catch (e) {
        message.channel.send("**humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.**")
    }
}

exports.help = {
    name: "deletartime"
}