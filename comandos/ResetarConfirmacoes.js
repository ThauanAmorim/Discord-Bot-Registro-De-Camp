const Discord = require("discord.js");
const { Message, Guild, MessageEmbed } = require("discord.js");
const CP = require("../ControlPanel.json")

exports.run = async (bot, message = new Message, args) => {
    var idStaff = CP.idStaff;
    var idChatSalvar = CP.idChatSalvarConfirmacaoTime;

    try {
        //verificar se o author tem o cargo de adm ou de capitão para usar o comando
        const idAuthor = message.author.id;
        var author = message.guild.members.cache.get(idAuthor);

        if (author.roles.cache.has(idStaff)) {
            var dados = await message.guild.channels.cache.get(idChatSalvar).messages.fetch({ limit: 100 });
            var contador = 0;
            await dados.forEach(element => {
                element.delete();
                contador++;
            });
            
            message.channel.send(`**Confirmações resetadas!. Deletada ${contador} confirmações de times.**`)
        } else {
            message.channel.send(`**Apenas ${message.guild.roles.cache.get(idStaff).name} podem usar o /ResetarConfirmações**`)
        }
        let arquivocmd = bot.commands.get("logs");
        if (arquivocmd) arquivocmd.run(author, message, args);
    } catch (e) {
        message.channel.send("**humm, algo deu errado!. Verifique se usou o comando corretamente e tente mais uma vez.**")
    }
}

exports.help = {
    name: "resetarconfirmações"
}