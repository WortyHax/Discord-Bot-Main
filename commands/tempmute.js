const ms = require("ms")
const discord = require("discord.js");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");
const emoji = require("../storage/emojis.json")
const sanction = require("../util/sanction");
const sanctionTypes = require("../structures/sanctionTypes");

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
                    "text": `${lang.tempmute.fail_1.footer} ${msg.author.username}`,
                    "icon_url": msg.author.avatarURL({ dynamic: true })
                },
                fields: [
                    {
                        "name": `${emoji.error} ${lang.tempmute.fail_1.title}`,
                        "value": `${lang.tempmute.fail_1.description}`
                    }
                ],
            }
        });
    }
    if (!args[1] || !ms(args[1])) {
        return msg.channel.send({
            embed: {
                color: config.embed.colors.negative,
                footer: {
                    "text": `${lang.tempmute.fail_2.footer} ${msg.author.username}`,
                    "icon_url": msg.author.avatarURL({ dynamic: true })
                },
                title: `${lang.tempmute.fail_2.title}`,
                description: `${lang.tempmute.fail_2.description}`,
            }
        });
    }

    let reason = args.slice(2).join(" ");
    if (reason.length <= 0) reason = `${lang.tempmute.reason}`;
    const role = msg.guild.roles.cache.find(x => x.id === config.roles.muted);
    const logs = Client.channels.cache.get(config.logs.logs.moderation)

    msg.guild.member(msg.mentions.users.first()).roles.add(role).then(_ => {
        sanction(
            sanctionTypes.TEMPMUTE,
            msg.author,
            msg.mentions.members.first(),
            msg.guild,
            reason,
            new Date(new Date().getTime() + ms(args[1])),)
        const embed = new discord.MessageEmbed()
        .setColor(config.embed.colors.mainColor)
        .setFooter(config.embed.footer, config.embed.thumbnail)
        .setTitle(`${lang.tempmute.success.title}`)
        .setTimestamp()
        .setThumbnail(msg.mentions.users.first().avatarURL({ dynamic: true }))
        .setDescription(`${msg.mentions.users.first()} ${lang.tempmute.success.description} \`${args[1]}\`.`);

        const muteLogs = new discord.MessageEmbed()
        .setAuthor(`${lang.tempmute.logs.title}`, msg.author.avatarURL({ dynamic: true }))
        .setColor(config.embed.colors.mainColor)
        .setThumbnail(config.embed.thumbnail)
        .setDescription(`
        ${lang.tempmute.logs.description_1}
        ${lang.tempmute.logs.description_2} <@${msg.author.id}>
        ${lang.tempmute.logs.description_3} \`${msg.author.id}\`
        ${lang.tempmute.logs.description_4} <@${msg.mentions.users.first().id}>
        ${lang.tempmute.logs.description_5} \`${msg.mentions.users.first().id}\`
        ${lang.tempmute.logs.description_6} \`${args[1]}\`
        ${lang.tempmute.logs.description_7}
        ${reason}`)

        msg.channel.send(embed);
        logs.send(muteLogs)

        embed.setTitle(`${lang.tempmute.dm.title}`)
        .setDescription(`${lang.tempmute.dm.description_1} \`${args[1]}\` ${lang.tempmute.dm.description_2} **${msg.guild.name}**${lang.tempmute.dm.description_3}\n
        ${lang.tempmute.dm.description_4}\n\`${reason}\``);
        msg.mentions.users.first().send(embed);
    });
}

module.exports.help = {
    name: `${config.tempmute.command_name}`,
    description: `${config.tempmute.command_description}`,
    permissions: [
        `${config.tempmute.command_permissions.permission_1}`,
        `${config.tempmute.command_permissions.permission_2}`,
        `${config.tempmute.command_permissions.permission_3}`,
        `${config.tempmute.command_permissions.permission_4}`,
        `${config.tempmute.command_permissions.permission_5}`
    ],
    alias: [
        `${config.tempmute.command_aliases.alias_1}`,
        `${config.tempmute.command_aliases.alias_2}`,
        `${config.tempmute.command_aliases.alias_3}`
    ],
    usage: `${config.tempmute.command_usage}`,
}