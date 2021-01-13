const Discord = require("discord.js");
const { Message, Guild } = require("discord.js");
const CP = require("../ControlPanel.json");

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff
    var idTeamLeader = CP.idTeamLeader;
    var nomeDaCategoria = CP.nomeDaCategoriaTimes;

    const cargoAdm = message.guild.roles.cache.get(idStaff);
    const cargoTeamLeader = message.guild.roles.cache.get(idTeamLeader);

    try {
        if (message.channel.id === CP.chatBot) { 
            //verificar se o author tem o cargo de adm ou de capitão para usar o comando
            const idAuthor = message.author.id;
            const author = message.guild.members.cache.get(idAuthor);
    
            if (author.roles.cache.has(idStaff) || author.roles.cache.has(idTeamLeader)) {
                if (args.length < 2) {
                    message.channel.send("Digite o comando e em seguinda coloque o nome do time tudo junto e logo apos isso mencione os players do seu time! ex.: /registrartime time1 @membro @membro")
                } else if (args[0].indexOf("<@") != -1) {
                    message.channel.send("Você deve digitar o nome do Time e não mencionar um cargo ou player")
                } else if (!(args[1].indexOf("<@") != -1)) { 
                    message.channel.send("Você deve digitar o nome do Time tudo junto. Ex.: /registrartime time1 @membro @membro")
                }else {
                    let listaDeCargosDoServer = message.guild.roles.cache;
                    var estadoDoNome = "";
        
                    listaDeCargosDoServer.forEach(element => {
                        if (element.name === args[0]) {
                            estadoDoNome = "Registrado";
                        }
                    });
                    if (!(estadoDoNome === "Registrado")) {
                        //cria o cargo dotime
                        await message.guild.roles.create({
                            data: {
                                name: args[0],
                                color: "fdbc35",
                                mentionable: true,
                                hoist: true,
                                permissions: 0
    
                            }
                        });
                        
                        var cargo = message.guild.roles.cache.array().find(r => r.name === args[0]);

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

                        let listaDeMembrosAdd = " - **RECEBERAM** - \n"; let listaDeMembroNaoAdd = " - **NÂO RECEBERAM** - \n";
                        message.mentions.members.forEach(membro => {
                            let contadorDeCargos = 0;
                            let cargos = membro.roles.cache;
                            cargosTimes.forEach(element => {
                                if (cargos.has(element.id)) {
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
                        });
                        let interval = setInterval(() => {
                            message.guild.member(message.author.id).roles.add(cargo)
                            message.guild.member(message.author.id).roles.add(message.guild.roles.cache.get(CP.idCargoPlayer))
                            if (message.guild.member(message.author.id).roles.cache.some(role => role.id === cargo.id) && message.guild.member(message.author.id).roles.cache.some(role => role.id === CP.idCargoPlayer)) {
                                clearInterval(interval);
                                
                            }
                        }, 500);
                        
                        //criar o voice chat
                        /* var contador = 0;
                        message.guild.channels.cache.forEach(element => {
                            if (element.type === "category" && element.name === nomeDaCategoria) {
                                contador++;
                            }
                        });
                        if (contador === 0) {
                            await message.guild.channels.create(
                                nomeDaCategoria,
                                {
                                    type: "category",
                                }
                            );
                        }
                        message.guild.channels.cache.forEach(element => {
                            if ((element.type === "category") && (element.name === nomeDaCategoria)) {
                                message.guild.channels.create(
                                    args[0],
                                    {
                                        type: "voice",
                                        parent: element,
                                        userLimit : 20,
                                        permissionOverwrites: [{
                                            id : cargo, 
                                            allow: ["CONNECT", "SPEAK", "VIEW_CHANNEL"]
                                        }],
                                        
                                    }
                                );
                            }
                        }); */
                        message.channel.send(`${listaDeMembrosAdd}${listaDeMembroNaoAdd}`);
                    } else {
                        await message.channel.send("**Este time Ja está registrado. Use o comandos AdicionarCargo ou DeletarTime**")
                    }
                }
            } else {
                message.channel.send("**Voce nao é da staff do server ou Capitao de um time**")
            }
            let arquivocmd = bot.commands.get("logs");
            if (arquivocmd) arquivocmd.run(author, message, args);
        } else{
            message.channel.send("**Bot não pode ser usado nesse chat**")
        }
    } catch (e) {
        message.channel.send("humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.")
    }
}

exports.help = {
    name: "registrartime"
}