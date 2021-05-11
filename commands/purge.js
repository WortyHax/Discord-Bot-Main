const Discord = require("discord.js");
const config = require("../storage/config.json");

module.exports.run = (Client, message, msg) => {

    const messageArray = message.content.split(' ');
	const args = messageArray.slice(1);

    const arg = new Discord.MessageEmbed()
    .setTitle('Tropic System')
    .setColor(config.embed.color)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`Please put a valid number! ${config.emojis.error}`)
    .setFooter(config.embed.footer)
    .setTimestamp()

    const number = new Discord.MessageEmbed()
    .setTitle('Tropic System')
    .setColor(config.embed.color)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`You can only delete 99 messages at once! (Discord rate limit) ${config.emojis.error}`)
    .setFooter(config.embed.footer)
    .setTimestamp()
    
    let deleteAmount;

    if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return message.channel.send(arg) }

    if (parseInt(args[0]) > 99) {
        return message.reply(number)
    } else {
        deleteAmount = parseInt(args[0]);
    }

    message.channel.bulkDelete(deleteAmount + 1, true);

    const success = new Discord.MessageEmbed()
    .setTitle('Tropic System')
    .setColor(config.embed.color)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`You have successfully deleted ${deleteAmount} messages! ${config.emojis.success}`)
    .setFooter(config.embed.footer)
    .setTimestamp()

    message.reply(success)
}

module.exports.help = {
    name: "purge",
    description: "Clear messages!",
    permissions: [
        "MANAGE_MESSAGES"
    ],
    alias: [
        "clean",
        "clear"
    ],
    usage: "purge <amount>",
}