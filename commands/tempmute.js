const ms = require("ms")
const discord = require("discord.js");
const config = require("../storage/config.json");
const sanction = require("../util/sanction");
const sanctionTypes = require("../structures/sanctionTypes");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    msg.delete();
    if (!msg.mentions.users.first()) {
        return msg.channel.send({
            embed: {
                color: config.embed.color,
                footer: config.embed.footer,
                title: "You have not specified a user to mute!",
            }
        });
    }
    if (!args[1] || !ms(args[1])) {
        return msg.channel.send({
            embed: {
                color: config.embed.color,
                footer: config.embed.footer,
                title: "You have either not specified an expiry or that is not a expiry I can understand!",
            }
        });
    }

    let reason = args.slice(2).join(" ");
    if (reason.length <= 0) reason = "No reason!";
    const role = msg.guild.roles.cache.find(x => x.id === config.mutedRole);

    msg.guild.member(msg.mentions.users.first()).roles.add(role).then(_ => {
        sanction(
            sanctionTypes.TEMPMUTE,
            msg.author,
            msg.mentions.members.first(),
            msg.guild,
            reason,
            new Date(new Date().getTime() + ms(args[1])),)
        const embed = new discord.MessageEmbed()
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTitle("User tempmuted!")
        .setTimestamp()
        .setDescription(`${msg.mentions.users.first()} has been tempmuted!`);

        msg.channel.send(embed);

        embed.setTitle(`You have been tempmuted in ${msg.guild.name}!`)
        .setDescription(`**Reason:**\n${reason}`);
        msg.mentions.users.first().send(embed);
    });
}

module.exports.help = {
    name: "tempmute",
    description: "Tempmute someone!",
    permissions: [
        "KICK_MEMBERS"
    ],
    alias: [],
    usage: "tempmute [@user] [duration] <reason>",
}