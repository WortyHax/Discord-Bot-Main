const ms = require("ms")
const discord = require("discord.js");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json")
const emoji = require("../storage/emojis.json")

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
                    "text": `${lang.mute.fail.footer} ${msg.author.username}`,
                    "icon_url": msg.author.avatarURL({ dynamic: true })
                },
                fields: [
                    {
                        "name": `${emoji.error} ${lang.mute.fail.title}`,
                        "value": `${lang.mute.fail.description}`
                    }
                ],
            }
        });
    }

    let reason = args.slice(1).join(" ");
    if (reason.length <= 0) reason = `${lang.mute.reason}`;
    const role = msg.guild.roles.cache.find(x => x.id === config.roles.muted);
    const usertomute = msg.mentions.users.first();
    const logs = Client.channels.cache.get(config.logs.logs.moderation)

    msg.guild.member(msg.mentions.users.first()).roles.add(role).then(_ => {
        const embed = new discord.MessageEmbed()
        .setColor(config.embed.colors.mainColor)
        .setFooter(config.embed.footer, config.embed.thumbnail)
        .setTitle(`${lang.mute.success.title}`)
        .setThumbnail(usertomute.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setDescription(`${msg.mentions.users.first()} ${lang.mute.success.description}`);

        const muteLogs = new discord.MessageEmbed()
        .setColor(config.embed.colors.mainColor)
        .setAuthor(`${lang.mute.logs.title}`, msg.author.avatarURL({ dynamic: true }))
        .setThumbnail(config.embed.thumbnail)
        .setDescription(`
        ${lang.mute.logs.description_1}
        ${lang.mute.logs.description_2} <@${msg.author.id}>
        ${lang.mute.logs.description_3} \`${msg.author.id}\`
        ${lang.mute.logs.description_4} <@${msg.mentions.users.first().id}>
        ${lang.mute.logs.description_5} \`${msg.mentions.users.first().id}\`
        ${lang.mute.logs.description_6}
        \`${reason}\``)

        msg.channel.send(embed)
        logs.send(muteLogs)

        embed.setTitle(`${lang.mute.dm.title}`)
        .setDescription(`${lang.mute.dm.description_1} **${msg.guild.name}**${lang.mute.dm.description_2}\n
        ${lang.mute.dm.description_3}
        \`${reason}\``);
        msg.mentions.users.first().send(embed);
    });
}

module.exports.help = {
    name: `${config.mute.command_name}`,
    description: `${config.mute.command_description}`,
    permissions: [
        `${config.mute.command_permissions.permission_1}`,
        `${config.mute.command_permissions.permission_2}`,
        `${config.mute.command_permissions.permission_3}`,
        `${config.mute.command_permissions.permission_4}`,
        `${config.mute.command_permissions.permission_5}`
    ],
    alias: [
        `${config.mute.command_aliases.alias_1}`,
        `${config.mute.command_aliases.alias_2}`,
        `${config.mute.command_aliases.alias_3}`
    ],
    usage: `${config.mute.command_usage}`,
}