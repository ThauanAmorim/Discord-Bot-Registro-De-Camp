const Discord = require("discord.js");
const { Message, Guild, MessageEmbed } = require("discord.js");
const CP = require("../ControlPanel.json")

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff;
    var idTeamLeader = CP.idTeamLeader;
    var idChatSalvar = CP.idChatSalvarConfirmacaoTime;
    var numerosDeTimes = CP.numerosDeTimes;

    try {
        //verificar se o author tem o cargo de adm ou de capitão para usar o comando
        const idAuthor = message.author.id;
        var author = message.guild.members.cache.get(idAuthor);

        if (author.roles.cache.has(idStaff)) {
            if ((args.length <= 2) || (args.length > 3)) {
                message.channel.send("**Digite o comando e depois o nome da sala, senha e hora de inicio da partida! Ex.: /Treino NomeDaSala Senha HoraDeInicio**")
            } else {
                
                let chat = message.guild.channels.cache.get(idChatSalvar);
                var dados = await message.guild.channels.cache.get(idChatSalvar).messages.fetch({ limit: 100 });
                var contador = 1;
                var textoSaida = "";
                 await dados.array().reverse().forEach(element => {
                    if (contador <= numerosDeTimes) {
                        message.guild.members.cache.get(element.content.split(" ")[0]).send(`**PARTIDA CUSTOM PUBG COMMUNITY**
**Nome:** ${args[0]}
**Senha:** ${args[1]}
**Slot:** ${element.content.split(" ")[2]}
**Hora do start:** ${args[2]}`);
                        let player = message.guild.members.cache.get(element.content.split(" ")[0]);
                        let time = message.guild.roles.cache.get(element.content.split(" ")[1]);
                        textoSaida += `Player: ${player.displayName} | Time: <@&${time.id}>\n`
                    }
                    contador++;
                }); 

                message.channel.send(`**Enviado a senha\n${textoSaida}**`)
            }
            
        } else {
            message.channel.send(`**Apenas ${message.guild.roles.cache.get(idStaff).name} podem usar o /Treino**`)
        }
        let arquivocmd = bot.commands.get("logs");
        if (arquivocmd) arquivocmd.run(author, message, args);
    } catch (e) {
        message.channel.send("**humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.**")
    }
}

exports.help = {
    name: "treino"
}