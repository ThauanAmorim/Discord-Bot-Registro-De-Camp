const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const CP = require("../ControlPanel.json")

exports.run = (bot, message = new Discord.Message, args) => {
    

    let textoEmbed = "";

    //comandos Staff
    textoEmbed += 
    `**    -- Comandos de uso da Staff -- ** 
    **/AdicionarCapitão** | Ex.: /AdicionarCapitão @membro1 @memebro2 @membro3 ...
    **/RemoverCapitão** | Ex.: /RemoverCapitão @membro1 @memebro2 @membro3 ...
    **/ResetarConfirmações** | EX.: /ResetarConfirmações
    **/Treino** | Ex.: /Treino NomeDaSala Senha HoraDeInicio
    **/ListarConfirmações** | Ex.: /ListarConfirmações

    `
    //Comandos TeamLeader
    textoEmbed +=
    `**-- Comandos de uso dos ${message.guild.roles.cache.get(CP.idTeamLeader).name} --**
    **/AdicionarCargo** | Ex.: /AdicionarCargo @cargoTime @membro1 @membro2 @membro3 ...
    **/RemoverCargo** | Ex.: /RemoverCargo @cargoTime @membro1 @membro2 @membro3 ...
    **/Confirmar** | Ex.: /Confirmar @CargoTime
    **/RemoverConfirmação** | Ex.: /RemoverConfirmação
    **/RegistrarTime** | Ex.: /RegistrarTime NomeDoTime @membro1 @membro2 @membro3 ...
    **/DeletarTime** | Ex.: /DeletarTime @CargoTime
    **/EditarNome** | Ex.: /EditarNome @cargoTime novoNome

    `
    //comandos geral
    textoEmbed += 
    `**-- Comandos uso geral --**
    **/info** | Ex.: /Info
    **/uptime** | Ex.: /uptime
    **/ListarTimes** | Ex.: /ListarTimes
    **/SairTime** | Ex.: /SairTime @cargoTime

    `



    const embed = new MessageEmbed()
        .setTitle('LISTA DE COMANDOS')
        .setColor(299177)
        .setDescription(textoEmbed)

    message.channel.send(textoEmbed)
}

exports.help = {
    name: "comandos"
}