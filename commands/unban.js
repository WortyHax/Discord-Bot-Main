const discord = require("discord.js")
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");
const emoji = require("../storage/emojis.json")

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    msg.delete();
    if (!args[0]) {
        return msg.channel.send(
            new discord.MessageEmbed()
            .setColor(config.embed.colors.mainColor)
            .addField(`${emoji.error} ${lang.unban.fail.title}`, `${lang.unban.fail.description}`)
            .setFooter(`${lang.unban.fail.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
        )}
    
    const reasonFailed = new discord.MessageEmbed()
    .addField(`${emoji.error} ${lang.unban.fail2.title}`, `${lang.unban.fail2.description}`)
    .setColor(config.embed.colors.mainColor)
    .setFooter(`${lang.unban.fail2.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))

    const reason = args.slice(1).join(" ");
    const member = msg.mentions.users.first() || args[0];
    const logs = Client.channels.cache.get(config.logs.logs.moderation)

    if(!reason) return msg.channel.send(reasonFailed)

    msg.guild.members.unban(member).then(u => {
        const logsMessage = new discord.MessageEmbed()
        .setAuthor(`${lang.unban.logs.title}`, msg.author.avatarURL({ dynamic: true }))
        .setColor(config.embed.colors.mainColor)
        .setThumbnail(config.embed.thumbnail)
        .setDescription(`
        ${lang.unban.logs.description_1}
        ${lang.unban.logs.description_2} <@${msg.author.id}>
        ${lang.unban.logs.description_3} \`${msg.author.id}\`
        ${lang.unban.logs.description_4} <@${args[0]}>
        ${lang.unban.logs.description_5} \`${args[0]}\`
        ${lang.unban.logs.description_6}
        \`${reason}\``)
        const embed = new discord.MessageEmbed()
        .setColor(config.embed.colors.mainColor)
        .setFooter(config.embed.footer, config.embed.thumbnail)
        .setThumbnail(config.embed.thumbnail)
        .setTitle(`${lang.unban.success.title}`)
        .setTimestamp()
        .setDescription(`<@${args[0]}> ${lang.unban.success.description_1} <@${msg.author.id}>${lang.unban.success.description_2}`);
        msg.channel.send(embed).then(logs.send(logsMessage));
    }).catch(_err => {
        const embed = new discord.MessageEmbed()
        .setTitle(`${lang.unban.fail1.title}`)
        .setDescription(`${lang.unban.fail1.description}`)
        .setThumbnail(config.embed.thumbnail)
        .setColor(config.embed.colors.negative)
        .setTimestamp()
        .setFooter(config.embed.footer, config.embed.thumbnail);
    })
}

module.exports.help = {
    name: `${config.unban.command_name}`,
    description: `${config.unban.command_description}`,
    permissions: [
        `${config.unban.command_permissions.permission_1}`,
        `${config.unban.command_permissions.permission_2}`,
        `${config.unban.command_permissions.permission_3}`,
        `${config.unban.command_permissions.permission_4}`,
        `${config.unban.command_permissions.permission_5}`
    ],
    alias: [
        `${config.unban.command_aliases.alias_1}`,
        `${config.unban.command_aliases.alias_2}`
    ],
    usage: `${config.unban.command_usage}`,
}