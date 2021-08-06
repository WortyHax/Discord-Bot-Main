const Discord = require("discord.js");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json")
const emoji = require("../storage/emojis.json");

module.exports.run = (Client, message) => {
    message.delete();

    const purge = require('./purge')
    const messageArray = message.content.split(' ');
	const args = messageArray.slice(1);

    const arg = new Discord.MessageEmbed()
    .setTitle(`${config.embed.systemTitle}`)
    .setColor(config.embed.colors.negative)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.purge.args.description} ${emoji.error}`)
    .setFooter(`${lang.purge.args.footer} ${config.settings.prefix}${purge.help.usage}`, `${message.author.avatarURL({ dynamic: true })}`)
    .setTimestamp()

    const number = new Discord.MessageEmbed()
    .setTitle(`${config.embed.systemTitle}`)
    .setColor(config.embed.colors.negative)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.purge.number.description} ${emoji.error}`)
    .setFooter(`${lang.purge.number.footer} ${config.settings.prefix}${purge.help.usage}`, message.author.avatarURL({ dynamic: true }))
    .setTimestamp()
    
    let deleteAmount;

    if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return message.channel.send(arg).then(msg => {
        msg.delete({ timeout: 10000 })
    }) }

    if (parseInt(args[0]) > 100) {
        return message.reply(number).then(msg => {
            msg.delete({ timeout: 10000 })
        })
    } else {
        deleteAmount = parseInt(args[0]);
    }

    message.channel.bulkDelete(deleteAmount, true);

    const success = new Discord.MessageEmbed()
    .setTitle(`${config.embed.systemTitle}`)
    .setColor(config.embed.colors.positive)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.purge.success.description_1} ${deleteAmount} ${lang.purge.success.description_2} ${emoji.success}`)
    .setFooter(`${lang.purge.success.footer}`, message.author.avatarURL({ dynamic: true }))
    .setTimestamp()

    message.reply(success).then(msg => {
        msg.delete({ timeout: 10000 })
    })
}

module.exports.help = {
    name: `${config.purge.command_name}`,
    description: `${config.purge.command_description}`,
    permissions: [
        `${config.purge.command_permissions.permission_1}`,
        `${config.purge.command_permissions.permission_2}`,
        `${config.purge.command_permissions.permission_3}`,
        `${config.purge.command_permissions.permission_4}`,
        `${config.purge.command_permissions.permission_5}`
    ],
    alias: [
        `${config.purge.command_aliases.alias_1}`,
        `${config.purge.command_aliases.alias_2}`,
        `${config.purge.command_aliases.alias_3}`,
        `${config.purge.command_aliases.alias_4}`,
        `${config.purge.command_aliases.alias_5}`
    ],
    usage: `${config.purge.command_usage}`,
}