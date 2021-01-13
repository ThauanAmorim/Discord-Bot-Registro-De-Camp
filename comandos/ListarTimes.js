const Discord = require("discord.js");
const { Message, Guild, MessageEmbed } = require("discord.js");
const CP = require("../ControlPanel.json")

exports.run = async (bot, message = new Message, args) => {
    var cargoBot = message.guild.roles.cache.get(CP.idCargoBot)

    try {
        if (message.channel.id === CP.chatBot) {
            //verificar se o author tem o cargo de adm ou de capitão para usar o comando
            const idAuthor = message.author.id;
            var author = message.guild.members.cache.get(idAuthor);

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
            
            var textoEmbed = "";
            var numeroDeTimes = 0;
            for (let index = cargosDoServerOrganizados.indexOf(cargoBot)+3; index < cargosDoServerOrganizados.length - 1; index++) {
                textoEmbed += `✅ **${cargosDoServerOrganizados[index].name}:** `
                var listaDeMembros = message.guild.roles.cache.get(cargosDoServerOrganizados[index].id).members.array();
                listaDeMembros.forEach(element => {
                    if (listaDeMembros.indexOf(element) === listaDeMembros.length-1) {
                        textoEmbed += element.displayName + ".";
                    } else {
                        textoEmbed += element.displayName + ", ";
                    }
                });
                textoEmbed += "\n";
                numeroDeTimes++;
                
            }

            const embed = new MessageEmbed()
                .setTitle(`NUMERO DE TIMES: ${numeroDeTimes}`)
                .setColor(299177)
                .setDescription(textoEmbed)
            
            message.channel.send(embed);
            
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
    name: "listartimes"
}