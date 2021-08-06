const Discord = require("discord.js");
const config = require("../storage/config.json");
const emoji = require("../storage/emojis.json");
const lang = require("../storage/lang.json");

module.exports.run = (Client, msg, args) => {
    msg.delete();

    const embed = new Discord.MessageEmbed()
        .setTitle(`${lang.ping.title}`)
        .setColor(config.embed.colors.mainColor)
        .setDescription(`
        ${lang.ping.description_title}
        ${emoji.loading} ${lang.ping.latency_1} \`${Date.now() - msg.createdTimestamp}${lang.ping.ms}\`${lang.ping.dot}
        ${emoji.loading} ${lang.ping.latency_2} \`${Math.round(Client.ws.ping)}${lang.ping.ms}\`${lang.ping.dot}`)
        .setFooter(config.embed.footer)
        .setThumbnail(config.embed.thumbnail)
        .setTimestamp()
        msg.channel.send(embed)
}

module.exports.help = {
    name: `${config.ping.command_name}`,
    description: `${config.ping.command_description}`,
    permissions: [],
    alias: [
        `${config.ping.command_aliases.alias_1}`,
        `${config.ping.command_aliases.alias_2}`
    ],
    usage: `${config.ping.command_usage}`,
}