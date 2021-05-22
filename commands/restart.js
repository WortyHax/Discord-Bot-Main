const Discord = require("discord.js");
const config = require("../storage/config.json");

module.exports.run = (Client, message) => {

    const embed = new Discord.MessageEmbed()
        .setTitle('System is restarting')
        .setColor(config.embed.color)
        .setDescription(`Restarting ${config.emojis.loading}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    const error = new Discord.MessageEmbed()
        .setTitle(config.embed.title)
        .setColor(config.embed.color)
        .setDescription(`Sorry, but you don't have permission to do that! ${config.emojis.error}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()
    
    const success = new Discord.MessageEmbed()
        .setTitle(config.embed.title)
        .setColor(config.embed.color)
        .setDescription(`Successfully restarted bot! ${config.emojis.success}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

if (message.author.id !== config.settings.botOwner) return message.channel.send(error);
    message.channel.send(embed)
    .then(() => Client.destroy())
    .then(() => Client.login(config.token))
    .then(() => message.channel.send(success))
    console.log('Bot restarted!')
};

module.exports.help = {
    name: "restart",
    description: "Restart bot.",
    permissions: [],
    alias: [
        "reset"
    ],
    usage: "restart",
}