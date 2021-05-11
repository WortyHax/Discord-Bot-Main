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
    .setTitle("**ServerName | Demotion**")
    .setAuthor("Botname", "https://yt3.ggpht.com/a/AATXAJwid-zC3NvzSoSORwFkWS0PTNlKvJPqgQv46Q=s900-c-k-c0xffffffff-no-rj-mo")
    .setColor(config.embed.color)
    .setDescription(`${msg.mentions.users.first()} has been __demoted__ to ${args.slice(1)[0]} by ${msg.author}.`)
    .setFooter(config.embed.footer);

    channel.send(embed);

}

module.exports.help = {
    name: "demote",
    description: "Demote a staff member!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [],
    usage: "demote [@user] [role]",
}