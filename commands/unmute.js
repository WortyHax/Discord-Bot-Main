const ms = require("ms")
const discord = require("discord.js");
const config = require("../storage/config.json");
const emoji = require("../storage/emojis.json")
const lang = require("../storage/lang.json")

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    msg.delete();
    if (!msg.mentions.users.first()) {
        return msg.channel.send({
            embed: {
                color: config.embed.colors.negative,
                footer: {
                    "text": `${lang.unmute.fail.footer} ${msg.author.username}`,
                    "icon_url": msg.author.avatarURL({ dynamic: true })
                },
                fields: [
                    {
                        "name": `${emoji.error} ${lang.unmute.fail.title}`,
                        "value": `${lang.unmute.fail.description}`
                    }
                ],
            }
        });
    }

    let reason = args.slice(1).join(" ");
    if (reason.length <= 0) reason = `${lang.unmute.reason}`;
    const role = msg.guild.roles.cache.find(x => x.id === config.roles.muted);
    const logs = Client.channels.cache.get(config.logs.logs.moderation)

    msg.guild.member(msg.mentions.users.first()).roles.remove(role).then(_ => {
        const embed = new discord.MessageEmbed()
        .setColor(config.embed.colors.mainColor)
        .setFooter(config.embed.footer, config.embed.thumbnail)
        .setTitle(`${lang.unmute.success.title}`)
        .setTimestamp()
        .setThumbnail(msg.mentions.users.first().displayAvatarURL({ dynamic: true }))
        .setDescription(`${msg.mentions.users.first()} ${lang.unmute.success.description}`);

        const muteLogs = new discord.MessageEmbed()
        .setColor(config.embed.colors.mainColor)
        .setAuthor(`${lang.unmute.logs.title}`, msg.author.avatarURL({ dynamic: true }))
        .setThumbnail(config.embed.thumbnail)
        .setDescription(`
        ${lang.unmute.logs.description_1}
        ${lang.unmute.logs.description_2} <@${msg.author.id}>
        ${lang.unmute.logs.description_3} \`${msg.author.id}\`
        ${lang.unmute.logs.description_4} <@${msg.mentions.users.first().id}>
        ${lang.unmute.logs.description_5} \`${msg.mentions.users.first().id}\`
        ${lang.unmute.logs.description_6}
        \`${reason}\``)

        msg.channel.send(embed);
        logs.send(muteLogs)

        embed.setTitle(`${lang.unmute.dm.title}`);
        embed.setDescription(`${lang.unmute.dm.description_1} **${msg.guild.name}**${lang.unmute.dm.description_2}\n
        ${lang.unmute.dm.description_3}
        \`${reason}\``);
        msg.mentions.users.first().send(embed);
    });
}

module.exports.help = {
    name: `${config.unmute.command_name}`,
    description: `${config.unmute.command_description}`,
    permissions: [
        `${config.unmute.command_permissions.permission_1}`,
        `${config.unmute.command_permissions.permission_2}`,
        `${config.unmute.command_permissions.permission_3}`,
        `${config.unmute.command_permissions.permission_4}`,
        `${config.unmute.command_permissions.permission_5}`
    ],
    alias: [
        `${config.unmute.command_aliases.alias_1}`,
        `${config.unmute.command_aliases.alias_2}`,
        `${config.unmute.command_aliases.alias_3}`
    ],
    usage: `${config.unmute.command_usage}`,
}