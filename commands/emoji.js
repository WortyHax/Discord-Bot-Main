const Discord = require("discord.js");
const emoji = require("../storage/emojis.json")
const config = require("../storage/config.json")

module.exports.run = (Client, msg, args) => {

    const embed = new Discord.MessageEmbed()
    .setDescription(`${config.suggestion.emojis.yes}`)
    msg.channel.send(embed)
}

module.exports.help = {
    name: "emoji",
    description: "Testing emojis.json",
    permissions: [],
    alias: [],
    usage: "emoji",
}