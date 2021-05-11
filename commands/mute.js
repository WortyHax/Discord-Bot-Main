const ms = require("ms")
const discord = require("discord.js");
const config = require("../storage/config.json");

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

    let reason = args.slice(1).join(" ");
    if (reason.length <= 0) reason = "No reason!";
    const role = msg.guild.roles.cache.find(x => x.id === config.mutedRole);

    msg.guild.member(msg.mentions.users.first()).roles.add(role).then(_ => {
        const embed = new discord.MessageEmbed()
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTitle("User muted!")
        .setTimestamp()
        .setDescription(`${msg.mentions.users.first()} has been muted!`);

        msg.channel.send(embed);

        embed.setTitle(`You have been muted in ${msg.guild.name}!`)
        .setDescription(`**Reason:**\n${reason}`);
        msg.mentions.users.first().send(embed);
    });
}

module.exports.help = {
    name: "mute",
    description: "Mute someone!",
    permissions: [
        "KICK_MEMBERS"
    ],
    alias: [],
    usage: "mute [@user] <reason>",
}