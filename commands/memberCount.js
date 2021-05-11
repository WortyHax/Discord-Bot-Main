const Discord = require("discord.js");
const config = require("../storage/config.json")

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, message) => {

    const members = message.guild.members.cache;

    const embed = new Discord.MessageEmbed()
	.setColor(config.embed.color)
	.setTitle(config.embed.title)
	.setDescription(`Member Count:
    \u3000➥ Total: \`${Client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\`
    \u3000➥ Online: \`${members.filter(member => member.presence.status === 'online').size}\`
    \u3000➥ Idle: \`${members.filter(member => member.presence.status === 'idle').size}\`
    \u3000➥ Do Not Disturb: \`${members.filter(member => member.presence.status === 'dnd').size}\`
    \u3000➥ Offline: \`${members.filter(member => member.presence.status === 'offline').size}\``)
	.setThumbnail(config.embed.thumbnail)
	.setTimestamp()
	.setFooter(config.embed.footer);

    message.channel.send(embed);
}

module.exports.help = {
    name: "memberCount",
    description: "Get memberCount of the guild!",
    permissions: [],
    alias: [
        "membercount"
    ],
    usage: "memberCount",
}