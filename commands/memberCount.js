const Discord = require("discord.js");
const config = require("../storage/config.json")
const lang = require("../storage/lang.json")

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, message) => {
    message.delete();

    const members = message.guild.members.cache;

    const embed = new Discord.MessageEmbed()
    .setTitle(`${lang.member_count.count_title} ${message.guild.name}`)
	.setColor(config.embed.colors.mainColor)
	.setDescription(`${lang.member_count.count_description}
    \u3000${lang.member_count.count_total} \`${Client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\`
    \u3000${lang.member_count.count_online} \`${members.filter(member => member.presence.status === 'online').size}\`
    \u3000${lang.member_count.count_idle} \`${members.filter(member => member.presence.status === 'idle').size}\`
    \u3000${lang.member_count.count_dnd} \`${members.filter(member => member.presence.status === 'dnd').size}\`
    \u3000${lang.member_count.count_offline} \`${members.filter(member => member.presence.status === 'offline').size}\``)
	.setThumbnail(config.embed.thumbnail)
	.setFooter(`${lang.member_count.count_footer} ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
    .setTimestamp()

    message.channel.send(embed);
}

module.exports.help = {
    name: `${config.memberCount.command_name}`,
    description: `${config.memberCount.command_description}`,
    permissions: [],
    alias: [
        `${config.memberCount.command_aliases.alias_1}`,
        `${config.memberCount.command_aliases.alias_2}`,
        `${config.memberCount.command_aliases.alias_3}`,
        `${config.memberCount.command_aliases.alias_4}`,
        `${config.memberCount.command_aliases.alias_5}`
    ],
    usage: `${config.memberCount.command_usage}`,
}