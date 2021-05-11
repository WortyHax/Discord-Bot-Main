const Discord = require("discord.js");
const config = require("../storage/config.json");

module.exports.run = (Client, message) => {

    const embed = new Discord.MessageEmbed()
        .setTitle('System is shutting down')
        .setColor(config.embed.color)
        .setDescription(`Shutting down ${config.emojis.shutdown}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    const error = new Discord.MessageEmbed()
        .setTitle('Tropic System')
        .setColor(config.embed.color)
        .setDescription(`Sorry, but you don't have permission to do that! ${config.emojis.error}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    if (message.author.id !== config.bot_owner) return message.channel.send(error);
        message.channel.send(embed).then(m => { 
            Client.destroy();
})};

module.exports.help = {
    name: "shutdown",
    description: "Shutdown bot.",
    permissions: [],
    alias: [
        "stop"
    ],
    usage: "shutdown",
}