const Discord = require("discord.js");
const config = require("../storage/config.json");
const emoji = require("../storage/emojis.json");
const lang = require("../storage/lang.json");

module.exports.run = async (bot, message, args) => {
    message.delete();

    const command = new Discord.MessageEmbed()
        .setTitle(`${lang.reload.error.not_a_valid_command.command_title}`)
        .setColor(config.embed.colors.mainColor)
        .setDescription(`${lang.reload.error.not_a_valid_command.command_description} ${emoji.error}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(`${lang.reload.error.not_a_valid_command.command_footer} ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()

    if(!args[0]) return message.channel.send(command)

    const error = new Discord.MessageEmbed()
        .setTitle(`${lang.reload.error.error.error_title}`)
        .setColor(config.embed.colors.mainColor)
        .setDescription(`${lang.reload.error.error.error_description} \`${args[0].toLowerCase()}\` ${emoji.error}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(`${lang.reload.error.error.error_footer} ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()

    const success = new Discord.MessageEmbed()
        .setTitle(`${lang.reload.success.success_title}`)
        .setColor(config.embed.colors.mainColor)
        .setDescription(`${lang.reload.success.success_description_1} \`${args[0].toLowerCase()}\` ${lang.reload.success.success_description_2} ${emoji.success}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(`${lang.reload.success.success_footer} ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()

    let commandName = args[0].toLowerCase()

    try {
        delete require.cache[require.resolve(`./${commandName}.js`)]
        bot.commands.delete(commandName)
        const pull = require(`./${commandName}.js`)
        bot.commands.set(commandName, pull)
    } catch(e) {
        return message.channel.send(error)
    }

    message.channel.send(success)

}

module.exports.help = {
    name: `${config.reload.command_name}`,
    description: `${config.reload.command_description}`,
    permissions: [
        `${config.reload.command_permissions.permission_1}`,
        `${config.reload.command_permissions.permission_2}`,
        `${config.reload.command_permissions.permission_3}`,
        `${config.reload.command_permissions.permission_4}`,
        `${config.reload.command_permissions.permission_5}`
    ],
    alias: [
            `${config.reload.command_aliases.alias_1}`,
            `${config.reload.command_aliases.alias_2}`
    ],
    usage: `${config.reload.command_usage}`,
}