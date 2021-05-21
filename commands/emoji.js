const Discord = require("discord.js");
const emojis = require("../storage/emojis.json")

module.exports.run = (Client, msg, args) => {

    const embed = new Discord.MessageEmbed()
    .setDescription(emojis.emojis.success)
    msg.channel.send(embed)
}

module.exports.help = {
    name: "emoji",
    description: "Testing Emojis.json",
    permissions: [],
    alias: [],
    usage: "emoji",
}