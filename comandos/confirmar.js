const Discord = require("discord.js");
const { Message, Guild } = require("discord.js");
const CP = require("../ControlPanel.json");

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff;
    var idTeamLeader = CP.idTeamLeader;
    var idChatSalvar = CP.idChatSalvarConfirmacaoTime;
    var numerosDeTimes = CP.numerosDeTimes;

    try {
        if (message.channel.id === CP.idchatDeConfirmacao) { 
            //verificar se o author tem o cargo de adm ou de capitão para usar o comando
            const idAuthor = message.author.id;
            var author = message.guild.members.cache.get(idAuthor);
    
            if (author.roles.cache.has(idTeamLeader)) {
                let cargosDoServerOriginal = await message.guild.roles.cache.array();
                var cargosDoServerOrganizados = []
                for (let index = 0; index < cargosDoServerOriginal.length; index++) {
                    cargosDoServerOriginal.forEach(element => {
                        if (element.position == index) {
                            cargosDoServerOrganizados[index] = element;
                        }
                    });
                }
                cargosDoServerOrganizados = cargosDoServerOrganizados.reverse();
                
                cargosDoServerOrganizados = cargosDoServerOrganizados.slice(cargosDoServerOrganizados.indexOf(message.guild.roles.cache.get(CP.idCargoBot)) + 3, cargosDoServerOrganizados.length-1)

                var cargoDoTime = message.mentions.roles.first();
                if (args.length < 1) {
                    message.channel.send("**Menciona seu time logo em seguida. Ex.: /confirmar @cargoTime**")
                } else if (cargosDoServerOrganizados.indexOf(cargoDoTime) === -1) { 
                    message.channel.send("**Você so pode confirmar times**")
                } else if (!(author.roles.cache.has(cargoDoTime.id))) {
                    message.channel.send("**Você so pode confirmar o time que faz parte!**")
                } else {
                    let chat = message.guild.channels.cache.get(idChatSalvar);
                    var dados = await message.guild.channels.cache.get(idChatSalvar).messages.fetch({ limit: 100 });
                    let tamanhoOriginal = dados.length;
                    var mensagens = []; var contador = 0; var timeCadastrado = false; var posicaoTime = 0;
                    dados.array().reverse().forEach(element => {
                        mensagens[contador] = element.content
                        if (element.content.split(" ")[1].indexOf(cargoDoTime.id) != -1) {
                            timeCadastrado = true;
                            posicaoTime = contador;
                        }
                        contador++;
                    });
    
                    if ((mensagens.indexOf(`${idAuthor} ${cargoDoTime.id}`) != -1) || (timeCadastrado)) {
                        if (timeCadastrado) {
                            if (posicaoTime >= numerosDeTimes) {
                                message.channel.send(`**Seu time já está na espera, ele é o ${posicaoTime - numerosDeTimes + 1}º na fila**`)
                            } else {
                                message.channel.send(`**O time ${cargoDoTime.name} já está confirmado!**`)
                            }
                        } else if (mensagens.indexOf(author.id) < numerosDeTimes) {
                            message.channel.send(`**Seu time já está confirmado!**`)
                        }else {
                            message.channel.send(`**Seu time já está na espera, ele é o ${mensagens.length - numerosDeTimes + 1}º na fila**`)
                        }
                    } else{
                        if (mensagens.length >= numerosDeTimes) {
                            message.channel.send(`${author.displayName}, seu time ${cargoDoTime.name} está na ${mensagens.length - numerosDeTimes + 1}º posição da fila`)
                        } else {
                            message.channel.send(`${author.displayName}, seu time ${cargoDoTime.name} está confirmado. Receberá a senha no seu DM assim que alguém da staff enviar!**`)
                        }

                        //manda msg no chat de confirmações do sistema
                        if (mensagens.length < numerosDeTimes) {
                            let numerosPossiveis = [];
                            for (let index = 0; index < CP.numerosDeTimes; index++) {
                                numerosPossiveis[index] = index + 1;
                                
                            }
                            mensagens.forEach(element => {
                                let numero = element.split(" ")[2];
                                let index = numerosPossiveis.indexOf(parseInt(numero));
                                numerosPossiveis.splice(index, 1);
                            });

                            chat.send(`${idAuthor} ${cargoDoTime.id} ${numerosPossiveis[0]}`);
                        } else {
                            chat.send(`${idAuthor} ${cargoDoTime.id}`);
                        }
                    }
                }
            } else {
                message.channel.send(`**Apenas ${message.guild.roles.cache.get(idTeamLeader).name} podem usar a confirmação**`)
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
    name: "confirmar"
}