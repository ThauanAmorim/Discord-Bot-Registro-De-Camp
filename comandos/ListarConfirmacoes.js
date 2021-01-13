const Discord = require("discord.js");
const { Message, Guild, MessageEmbed } = require("discord.js");
const CP = require("../ControlPanel.json")

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff;
    var idChatSalvar = CP.idChatSalvarConfirmacaoTime;
    var numerosDeTimes = CP.numerosDeTimes;

    try {
        //verificar se o author tem o cargo de adm ou de capitão para usar o comando
        const idAuthor = message.author.id;
        var author = message.guild.members.cache.get(idAuthor);

        if (author.roles.cache.has(idStaff)) {
            var numeroDeConfirmacoes = 0;
            var dados = await message.guild.channels.cache.get(idChatSalvar).messages.fetch({ limit: 100 });
            var textoSaida = "";
            if (dados.array().length === 0) {
                textoSaida = "**Sem times confirmados!**"
            } else {
                var contador = 1;
                await dados.array().reverse().forEach(element => {
                    let player = message.guild.members.cache.get(element.content.split(" ")[0]);
                    let time = message.guild.roles.cache.get(element.content.split(" ")[1]);
                    if (contador <= numerosDeTimes) {
                        textoSaida += `Player: ${player.displayName} | Time: <@&${time.id}> | Slot: ${element.content.split(" ")[2]}\n`
                        numeroDeConfirmacoes++;
                    } else if (contador === numerosDeTimes+1) { 
                        textoSaida += `\nFila:\n${contador - numerosDeTimes}º - Player: ${player.displayName} | Time: <@&${time.id}>\n`
                    }else {
                        textoSaida += `${contador - numerosDeTimes}º - Player: ${player.displayName} | Time: <@&${time.id}>\n`
                    }
                    contador++;
                });
            }
            var textoTitulo = `Times Confirmados: ${numeroDeConfirmacoes}\n`;


            const embed = new MessageEmbed()
                .setTitle('**LISTA DE CONFIRMAÇÕES**')
                .setColor(299177)
                .setDescription(textoTitulo + textoSaida);

            message.channel.send(embed);
        } else {
            message.channel.send(`**Apenas ${message.guild.roles.cache.get(idStaff).name} podem usar o /ListaConfirmações**`)
        }
        let arquivocmd = bot.commands.get("logs");
        if (arquivocmd) arquivocmd.run(author, message, args);
    } catch (e) {
        console.log(e)
        message.channel.send("**humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.**")
    }
}

exports.help = {
    name: "listarconfirmações"
}