const discord = require("discord.js")
const config = require("../storage/config.json");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    if (!args[0]) {
        return msg.channel.send(new discord.MessageEmbed().setColor(config.embed.color).setTitle("No one mentioned to ban!").setTimestamp());
    }
    
    const reason = args.slice(1).join(" ");
    const member = msg.mentions.users.first() || args[0];

    msg.guild.members.unban(member).then(u => {
        const embed = new discord.MessageEmbed()
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTitle("User unbanned!")
        .setTimestamp()
        .setDescription(`Member has been unbanned!`);
        msg.channel.send(embed);
    }).catch(_err => {
        const embed = new discord.MessageEmbed()
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTitle("Invalid user!")
    })
}

module.exports.help = {
    name: "unban",
    description: "Unban someone!!",
    permissions: [
        "BAN_MEMBERS"
    ],
    alias: [],
    usage: "unban [@user] <reason>",
}