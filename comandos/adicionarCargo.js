const Discord = require("discord.js");
const { Message, Guild } = require("discord.js");
const CP = require("../ControlPanel.json");

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff
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
                    message.channel.send(`Digite o comando e em seguinda mencione os membros para receber o cargo ${cargoTeamLeader.name}! ex.: /AdicionarCargo @cargo @membro1 @membro2 @membro3`)
                } else if (cargoTeam.id === cargoTeamLeader.id) { 
                    message.channel.send(`Você não pode adicionar o cargo de ${cargoTeamLeader.name}`)
                } else {
                    let cargosDoServerOriginal = await message.guild.roles.cache.array();
                    var cargosDoServerOrganizados = []
                    var cargosTimes = []
                    for (let index = 0; index < cargosDoServerOriginal.length; index++) {
                        cargosDoServerOriginal.forEach(element => {
                            if (element.position == index) {
                                cargosDoServerOrganizados[index] = element;
                            }
                        });
                    }
                    cargosDoServerOrganizados = cargosDoServerOrganizados.reverse();

                    let posicaoRole = 0;
                    cargosDoServerOrganizados.forEach(element => {
                        if (element.id == CP.idCargoBot) {
                            posicaoRole = cargosDoServerOrganizados.indexOf(element);
                        }
                    });

                    //separar apenas times
                    let posicao = 0;
                    for (let index = posicaoRole + 3; index < cargosDoServerOrganizados.length - 1; index++) {
                        cargosTimes[posicao] = cargosDoServerOrganizados[index];
                        posicao++;

                    }

                    var cargo = message.mentions.roles.first();
                    let contadorDeCargos = 0;
                    let listaDeMembrosAdd = " - **RECEBERAM** - \n"; let listaDeMembroNaoAdd = " - **NÂO RECEBERAM** - \n";
                    message.mentions.members.forEach(membro => {
                        cargosTimes.forEach(element => {
                            if (membro.roles.cache.has(element.id)) {
                                contadorDeCargos++;
                            }

                        });
                        if (contadorDeCargos > 0) {
                            listaDeMembroNaoAdd += `${membro} - Faz parte de outro time\n`;
                        } else {
                            let interval = setInterval(() => {
                                membro.roles.add(cargo);
                                membro.roles.add(message.guild.roles.cache.get(CP.idCargoPlayer));
                                if (membro.roles.cache.some(role => role.id === cargo.id) && membro.roles.cache.some(role => role.id === CP.idCargoPlayer)) {
                                    clearInterval(interval);
                                }
                            }, 500);

                            listaDeMembrosAdd += `${membro}\n`;
                            
                        }
                        contadorDeCargos = 0;
                    });
    
    
                    message.channel.send(`${listaDeMembrosAdd}${listaDeMembroNaoAdd}`);
                }
            } else {
                message.channel.send(`Para adicionar o cargo ${cargoTeam.name} você deve ter o cargo do time!`)
            }
            let arquivocmd = bot.commands.get("logs");
            if (arquivocmd) arquivocmd.run(author, message, args);
        } else {
            message.channel.send("Bot não pode ser usado nesse chat");
        }
    } catch (e) {
        message.channel.send("humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.")
    }
}

exports.help = {
    name: "adicionarcargo"
}