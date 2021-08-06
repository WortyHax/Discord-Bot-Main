const discord = require('discord.js');
const config = require("../storage/config.json");
const lang = require("../storage/lang.json")
const emoji = require("../storage/emojis.json")

module.exports.run = (Client, msg, args) => {
    msg.delete();
    const usertokick = msg.mentions.users.first(); // bad guy variable
    const reason = args.join(" ").slice(23);

    const logs = Client.channels.cache.get(config.logs.logs.moderation)

    //embeds
    const kicksucceed = new discord.MessageEmbed()
        .addField(`${emoji.success} ${lang.kick.success.title}`, `${usertokick} ${lang.kick.success.description}`)
        .setColor(config.embed.colors.positive)
        .setFooter(`${lang.kick.success.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }));
    const kickfail1 = new discord.MessageEmbed()
        .addField(`${emoji.error} ${lang.kick.fail1.title}`, `${lang.kick.fail1.description}`)
        .setColor(config.embed.colors.negative)
        .setFooter(`${lang.kick.fail1.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }));
    const kickfail2 = new discord.MessageEmbed()
        .addField(`${emoji.error} ${lang.kick.fail2.title}`, `${lang.kick.fail2.description}`)
        .setColor(config.embed.colors.negative)
        .setFooter(`${lang.kick.fail2.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }));
    const kickfail3 = new discord.MessageEmbed()
        .addField(`${emoji.error} ${lang.kick.fail3.title}`, `${lang.kick.fail3.description}`)
        .setColor(config.embed.colors.negative)
        .setFooter(`${lang.kick.fail3.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }));

    const eReason = new discord.MessageEmbed()
        .addField(`${emoji.error} ${lang.kick.reason.title}`, `${lang.kick.reason.description}`)
        .setColor(config.embed.colors.negative)
        .setFooter(`${lang.kick.reason.footer} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
    if (usertokick) {
        const member = msg.guild.member(usertokick); // check if user is in guild
        if (!reason) return msg.channel.send(eReason)
        if (member) { // kick the user
            member.kick(`${member} kicked ${usertokick} for ${reason}`).then(() => {
                msg.channel.send(kicksucceed);
                const embed = new discord.MessageEmbed()
                    .setColor(config.embed.colors.mainColor)
                    .setAuthor(`${lang.kick.logs.title}`, msg.author.avatarURL({ dynamic: true }))
                    .setThumbnail(config.embed.thumbnail)
                    .setDescription(`
                    ${lang.kick.logs.description_1}
                    ${lang.kick.logs.description_2} <@${msg.author.id}>
                    ${lang.kick.logs.description_3} \`${msg.author.id}\`
                    ${lang.kick.logs.description_4} <@${usertokick.id}>
                    ${lang.kick.logs.description_5} \`${usertokick.id}\`
                    ${lang.kick.logs.description_6}
                    \`${reason}\``);
                logs.send(embed);
                usertokick.send({
                    "embed": {
                        "color": config.embed.colors.mainColor,
                        "author": {
                            "name": `${lang.kick.dm.title_1} ${msg.guild.name}${lang.kick.dm.title_2}`
                        },
                        "description": `${lang.kick.dm.description} ${reason}`,
                    }
                });
            }).catch(err => { // unable to kick user
                msg.channel.send(kickfail1)
                const embed = new discord.MessageEmbed()
                    .setColor(config.embed.colors.negative)
                    .setAuthor(`${lang.kick.rawError.title_1} ${msg.author.username} ${lang.kick.rawError.title_2} ${member}`)
                    .addField(`${lang.kick.rawError.description}`, err)
                    .setFooter(config.embed.footer);
                msg.channel.send(embed)
                return console.log(err);
            });
        } else { // user not in guild
            msg.channel.send(kickfail2);
        }
    } else { // user not mentioned
        msg.channel.send(kickfail3);
    }
}

module.exports.help = {
    name: `${config.kick.command_name}`,
    description: `${config.kick.command_description}`,
    permissions: [
        `${config.kick.command_permissions.permission_1}`,
        `${config.kick.command_permissions.permission_2}`,
        `${config.kick.command_permissions.permission_3}`,
        `${config.kick.command_permissions.permission_4}`,
        `${config.kick.command_permissions.permission_5}`
    ],
    alias: [
        `${config.kick.command_aliases.alias_1}`,
        `${config.kick.command_aliases.alias_2}`,
        `${config.kick.command_aliases.alias_3}`
    ],
    usage: `${config.kick.command_usage}`,
}