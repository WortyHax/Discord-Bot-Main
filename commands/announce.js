const discord = require("discord.js")
const config = require("../storage/config.json");
const lang = require("../storage/lang.json")
const emojis = require("../storage/emojis.json")
const logger = require("../logger")

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
            .setColor(config.embed.colors.negative)
            .setFooter(`${lang.announce.fail_1.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
            .setTitle(`${lang.announce.fail_1.title}`)
            .setDescription(`${emojis.error} ${lang.announce.fail_1.description_1}\n
            > ${lang.announce.fail_1.description_2} \`${lang.announce.fail_1.description_3}\` ${lang.announce.fail_1.description_4}`)
        ).then(msg => {
            msg.delete({ timeout: 15000 })
            }
        )
    }

    const announcement = new discord.MessageEmbed()
    .setColor(config.embed.colors.mainColor)
    .setFooter(`${lang.announce.success.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
    .setThumbnail(`${config.embed.thumbnail}`)
    .setTitle(args.join(" "))
    .setTimestamp();

    const embed = new discord.MessageEmbed()
    .setColor(config.embed.colors.mainColor)
    .setFooter(config.embed.footer, config.embed.thumbnail)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.announce.announceCreator_1.description}`)
    .setTitle(`${lang.announce.announceCreator_1.title}`)
    msg.channel.send(embed).then(m => {
        m.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 3600000})
            .then(collected => {
                announcement.setDescription(collected.first().content);
                collected.first().delete();

                embed.setTitle(`${lang.announce.announceCreator_2.title}`);
                embed.setDescription(`${lang.announce.announceCreator_2.description_1} \`${lang.announce.announceCreator_2.description_2}\``);
                m.edit(embed);

                m.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 3600000})
                    .then(collected2 => {
                        if (collected2.first().content !== `${lang.announce.announceCreator_2.description_2}`)
                            announcement.setImage(collected2.first().content)
                        
                        collected2.first().delete()

                        msg.guild.channels.cache.get(config.channels.announcements).send(announcement);

                        embed.setTitle(`${lang.announce.announceCreator_success.title}`);
                        embed.setDescription(`${lang.announce.announceCreator_success.description_1} <#${config.channels.announcements}>${lang.announce.announceCreator_success.description_2}`);
                        m.edit(embed).then(msg => {
                            msg.delete({ timeout: 10000 })
                        })
                    })
                    .catch(err => {
                        logger.error(err);
                        embed.setTitle(`${lang.announce.error.title}`);
                        embed.setDescription(`${lang.announce.error.description}`);
                        m.edit(embed);
                    })

            })
            .catch(err => {
                logger.error(err);
                embed.setTitle(`${lang.announce.error.title}`);
                embed.setDescription(`${lang.announce.error.description}`);
                m.edit(embed);
            })
    })
}

module.exports.help = {
    name: `${config.announce.command_name}`,
    description: `${config.announce.command_description}`,
    permissions: [
        `${config.announce.command_permissions.permission_1}`,
        `${config.announce.command_permissions.permission_2}`,
        `${config.announce.command_permissions.permission_3}`,
        `${config.announce.command_permissions.permission_4}`,
        `${config.announce.command_permissions.permission_5}`
    ],
    alias: [
        `${config.announce.command_aliases.alias_1}`,
        `${config.announce.command_aliases.alias_2}`,
        `${config.announce.command_aliases.alias_3}`
    ],
    usage: `${config.announce.command_usage}`,
}