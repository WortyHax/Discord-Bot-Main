const sanctionTypes = require("../structures/sanctionTypes");
const sanction = require("../util/sanction");
const discord = require("discord.js");
const config = require("../storage/config.json");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    if (!msg.mentions.users.first()) {
        return msg.channel.send(
            new discord.MessageEmbed()
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
            .setTitle("No user specified!")
            .setDescription("You have not specified a user to warn!")
        )
    }

    const reason = args.slice(1).join(" ");
    if (reason.length <= 0) {
        return msg.channel.send(
            new discord.MessageEmbed()
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
            .setTitle("No user specified!")
            .setDescription("You have not specified a user to warn!")
        )
    }

    const user = msg.mentions.users.first();
    sanction(sanctionTypes.WARN, msg.author, user, msg.guild, reason)
    user.send(
        new discord.MessageEmbed()
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTitle(`You have been warned in ${msg.guild.name}!`)
        .addFields([{
            name: "Reason",
            value: reason
        }])
    );
    msg.channel.send(new discord.MessageEmbed()
        .setColor(config.colors.positive)
        .setFooter(config.embed.footer)
        .setTimestamp()
        .setTitle("User warned!")
    )
}

module.exports.help = {
    name: "warn",
    description: "Warn a user!",
    permissions: [
        "KICK_MEMBERS"
    ],
    alias: [],
    usage: "warn [@user] [reason]",
}