const Discord = require("discord.js");
const { Message, Guild, MessageEmbed } = require("discord.js");
const CP = require("../ControlPanel.json")

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff;
    var idTeamLeader = CP.idTeamLeader;
    var idChatSalvar = CP.idChatSalvarConfirmacaoTime;

    try {
        //verificar se o author tem o cargo de adm ou de capitão para usar o comando
        const idAuthor = message.author.id;
        var author = message.guild.members.cache.get(idAuthor);
        
        if (author.roles.cache.has(idStaff) || author.roles.cache.has(idTeamLeader)) {
            if (author.roles.cache.has(idStaff) && ((args[0].indexOf("<@") === -1))) {
                message.channel.send(`**Digite o comando e menciona um player ou o cargo do time que deseja remover da confirmação!**`)
            } else {
                var encontradoTexto = false;
                var dados = await message.guild.channels.cache.get(idChatSalvar).messages.fetch({ limit: 100 });
                var tamanhoInicial = dados.array().length;
                var mensagens = []; var contador = 0;
                dados.array().reverse().forEach(element => {
                    mensagens[contador] = element
                    contador++;
                });

                var slotTime = "";
                await dados.forEach(element => {
                    if (!author.roles.cache.has(idTeamLeader)) {
                        if (element.content.split(" ")[0].indexOf(author.id) != -1) {
                            element.delete();
                            encontradoTexto = true;
                            slotTime = element.content.split(" ")[2];
                        }
                    } else {
                        if (message.mentions.members.first() != undefined) {
                            if (element.content.split(" ")[0].indexOf(message.mentions.members.first().id) != -1) {
                                element.delete();
                                encontradoTexto = true;
                                slotTime = element.content.split(" ")[2];
                            }
                        } else if (message.mentions.roles.first() != undefined) {
                            if (element.content.split(" ")[1].indexOf(message.mentions.roles.first().id) != -1) {
                                element.delete();
                                encontradoTexto = true;
                                slotTime = element.content.split(" ")[2];
                            }
                        }
                    }
                });
                if (!encontradoTexto) {
                    if (author.roles.cache.has(idStaff)) {
                        if (message.mentions.members.first()) {
                            message.channel.send(`**Não foi encontrada confirmação do ${message.mentions.members.first().displayName}**`)
                        } if (message.mentions.roles.first()) {
                            message.channel.send(`**Não foi encontrada confirmação do time ${message.mentions.roles.first().name}**`)
                        }
                    } else {
                        message.channel.send(`**Não foi encontrada confirmação no seu nome!**`)

                    }
                } else {
                    if (tamanhoInicial > CP.numerosDeTimes) {
                        var msgTimeConfirmacao = mensagens[CP.numerosDeTimes];
                        msgTimeConfirmacao.edit(msgTimeConfirmacao.content + ` ${slotTime}`);
                    }
                    message.channel.send(`**Removido sua confirmação!**`)
                }
            }
        } else {
            message.channel.send(`**Apenas ${message.guild.roles.cache.get(idTeamLeader).name} podem usar o /RemoverConfirmação**`)
        }
        let arquivocmd = bot.commands.get("logs");
        if (arquivocmd) arquivocmd.run(author, message, args);
                
    } catch (e) {
        message.channel.send("**humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.**")
    }
}

exports.help = {
    name: "removerconfirmação"
}