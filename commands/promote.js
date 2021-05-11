const discord = require('discord.js');
const config = require('../storage/config.json');

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    const channel = msg.guild.channels.cache.get(config.channels.staffmovement);

    const embed = new discord.MessageEmbed()
    .setTitle("**TropMC | Promotion**")
    .setAuthor("TropMC")
    .setColor(config.embed.color)
    .setDescription(`${msg.mentions.users.first()} has been __promoted__ to ${args.slice(1)[0]} by ${msg.author}.`)
    .setFooter(config.embed.footer);

    channel.send(embed);

}

module.exports.help = {
    name: "promote",
    description: "Promote a staff member!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [],
    usage: "promote [@user] [role] <reason>",
}