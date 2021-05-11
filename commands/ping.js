const Discord = require("discord.js");
const config = require("../storage/config.json");

module.exports.run = (Client, msg, args) => {

    const embed = new Discord.MessageEmbed()
        .setTitle('System\'\s latency')
        .setColor(config.embed.color)
        .setDescription(`${config.emojis.loading} Bot Latency is: \`${Date.now() - msg.createdTimestamp}ms\`. Discord API Latency is: \`${Math.round(Client.ws.ping)}ms\`. ${config.emojis.loading}`)
        .setFooter(config.embed.footer)
        .setThumbnail(config.embed.thumbnail)
        .setTimestamp()
        msg.channel.send(embed)
}

module.exports.help = {
    name: "ping",
    description: "Check bots latency.",
    permissions: [],
    alias: [
        "ms",
        "latency"
    ],
    usage: "ping",
}