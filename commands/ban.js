const discord = require("discord.js");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");
const emoji = require("../storage/emojis.json");
const sanction = require("../util/sanction");
const types = require("../structures/sanctionTypes");
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
                    "text": `${lang.ban.fail.footer} ${msg.author.username}`,
                    "icon_url": msg.author.avatarURL({ dynamic: true })
                },
                fields: [
                    {
                        "name": `${emoji.error} ${lang.ban.fail.title}`,
                        "value": `${lang.ban.fail.description}`
                    }
                ],
            }
        });
    }

    const usertoban = msg.mentions.users.first(); // bad guy variable
    const reason = args.join(" ").slice(23);

    const logs = Client.channels.cache.get(config.logs.logs.moderation)

    //embeds
    const bansucceed = new discord.MessageEmbed()
        .setTitle(`${lang.ban.success.title}`)
        .setDescription(`<@${usertoban.id}> ${lang.ban.success.description_1} <@${msg.author.id}>${lang.ban.success.description_2}`)
        .setThumbnail(usertoban.displayAvatarURL({ dynamic: true }))
        .setColor(config.embed.colors.mainColor)
        .setTimestamp()
        .setFooter(config.embed.footer, config.embed.thumbnail);
    const banfail1 = new discord.MessageEmbed()
        .addField(`${emoji.error} ${lang.ban.fail1.title}`, `${lang.ban.fail1.description}`)
        .setColor(config.embed.colors.mainColor)
        .setTimestamp()
        .setFooter(`${lang.ban.fail1.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }));
    const banfail2 = new discord.MessageEmbed()
        .addField(`${emoji.error} ${lang.ban.fail2.title}`, `${lang.ban.fail2.description}`)
        .setColor(config.embed.colors.mainColor)
        .setTimestamp()
        .setFooter(`${lang.ban.fail2.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }));
    const banfail3 = new discord.MessageEmbed()
        .addField(`${emoji.error} ${lang.ban.fail3.title}`, `${lang.ban.fail3.description}`)
        .setColor(config.embed.colors.mainColor)
        .setTimestamp()
        .setFooter(`${lang.ban.fail3.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }));
    const banfail4 = new discord.MessageEmbed()
        .addField(`${emoji.error} ${lang.ban.fail4.title}`, `${lang.ban.fail4.description}`)
        .setColor(config.embed.colors.mainColor)
        .setTimestamp()
        .setFooter(`${lang.ban.fail4.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }));

    if (usertoban) {
        const member = msg.guild.member(usertoban); // check if user is in guild
        if (!reason) return msg.channel.send(banfail4)
        if (member) { // kick the user
            member.ban({
                reason: `${member} ${lang.ban.success.reason.message_1} ${usertoban} ${lang.ban.success.reason.message_2} ${reason}`,
            }).then(() => {
                sanction(
                    sanctionTypes.BAN,
                    msg.author,
                    msg.guild,
                    usertoban,
                    reason);
                msg.channel.send(bansucceed);
                const embed = new discord.MessageEmbed()
                    .setColor(config.embed.colors.mainColor)
                    .setAuthor(`${lang.ban.logs.title}`, msg.author.avatarURL({ dynamic: true }))
                    .setThumbnail(config.embed.thumbnail)
                    .setDescription(`
                    ${lang.ban.logs.description_1}
                    ${lang.ban.logs.description_2} <@${msg.author.id}>
                    ${lang.ban.logs.description_3} \`${msg.author.id}\`
                    ${lang.ban.logs.description_4} <@${usertoban.id}>
                    ${lang.ban.logs.description_5} \`${usertoban.id}\`
                    ${lang.ban.logs.description_6}
                    \`${reason}\``);
                logs.send(embed);
                usertoban.send({
                    "embed": {
                        "color": config.embed.colors.mainColor,
                        "title": `${lang.ban.dm.title}`,
                        "description": `${lang.ban.dm.description_1} **${msg.guild.name}**${lang.ban.dm.description_2}\n\n${lang.ban.dm.description_3}\n\`${reason}\``,
                    }
                });
            }).catch(err => { // unable to kick user
                msg.channel.send(banfail1)
                const embed = new discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor(`${lang.ban.error.title_1} ${msg.author.username} ${lang.ban.error.title_2} ${member}`)
                    .addField(`${lang.ban.error.field}`, err)
                    .setFooter(config.embed.footer);
                msg.channel.send(embed);
                return console.log(err);
            });
        } else { // user not in guild
            msg.channel.send(banfail2);
        }
    } else { // user not mentioned
        msg.channel.send(banfail3);
    }
}

module.exports.help = {
    name: `${config.ban.command_name}`,
    description: `${config.ban.command_description}`,
    permissions: [
        `${config.ban.command_permissions.permission_1}`,
        `${config.ban.command_permissions.permission_2}`,
        `${config.ban.command_permissions.permission_3}`,
        `${config.ban.command_permissions.permission_4}`,
        `${config.ban.command_permissions.permission_5}`
    ],
    alias: [],
    usage: `${config.ban.command_usage}`,
}