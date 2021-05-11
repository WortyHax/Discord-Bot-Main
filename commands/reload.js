const Discord = require("discord.js");
const config = require("../storage/config.json");


module.exports.run = async (bot, message, args) => {

    const bot_owner = new Discord.MessageEmbed()
        .setTitle(config.embed.title)
        .setColor(config.embed.color)
        .setDescription(`Sorry, but you don't have permission to do that! ${config.emojis.error}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    const command = new Discord.MessageEmbed()
        .setTitle(config.embed.title)
        .setColor(config.embed.color)
        .setDescription(`Please enter a valid command! ${config.emojis.error}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    const error = new Discord.MessageEmbed()
        .setTitle(config.embed.title)
        .setColor(config.embed.color)
        .setDescription(`Could not reload command: \`${args[0].toLowerCase()}\` ${config.emojis.error}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    const success = new Discord.MessageEmbed()
        .setTitle(config.embed.title)
        .setColor(config.embed.color)
        .setDescription(`Successfully reloaded \`${args[0].toLowerCase()}\` command! ${config.emojis.success}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    if(message.author.id != config.bot_owner) return message.channel.send(bot_owner)

    if(!args[0]) return message.channel.send(command)

    let commandName = args[0].toLowerCase()

    try {
        delete require.cache[require.resolve(`./${commandName}.js`)] // usage !reload <name>
        bot.commands.delete(commandName)
        const pull = require(`./${commandName}.js`)
        bot.commands.set(commandName, pull)
    } catch(e) {
        return message.channel.send(error)
    }

    message.channel.send(success)

}

module.exports.help = {
    name: "reload",
    description: "Reload a command.",
    permissions: [],
    alias: [],
    usage: "reload <command>",
}