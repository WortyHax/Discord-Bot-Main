const discord = require("discord.js");
const logger = require("../logger");
const config = require("../storage/config.json");
const {rr} = require("../util/reactionRoleManager");

/**
 * Reaction Roles command
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    if (!(args[0] || args[1] || args[2])) {
        return msg.channel.send(
            new discord.MessageEmbed()
            .setColor(config.colors.negative)
            .setTitle("You have not specified an arguement")
            .setDescription("You have not given me a message ID, channel ID or role ID!")
            .setTimestamp()
            .setFooter(config.embed.footer)
        );
    }

    if (!(msg.guild.roles.cache.get(args[2]) || msg.guild.channels.cache.get(args[1]))) {
        return msg.channel.send(
            new discord.MessageEmbed()
            .setColor(config.colors.negative)
            .setTitle("Invalid channel or role!")
            .setDescription("You have not given me a valid message or channel ID!")
            .setTimestamp()
            .setFooter(config.embed.footer)
        );
    }

    const embed = new discord.MessageEmbed()
        .setColor(config.embed.color)
        .setTitle("React with the emoji")
        .setDescription("Please react with the emoji you wish your users to use in order to obtain this role")
        .setTimestamp()
        .setFooter(config.embed.footer)
    msg.channel.send(embed).then(m => {
        m.awaitReactions((r, u) => u.id == msg.author.id, {
                time: 3600000,
                max: 1
            })
            .then(collected => {
                const react = collected.first();

                react.remove();

                rr.create({
                    messageID: args[0],
                    channel: msg.guild.channels.cache.get(args[1]),
                    reaction: react.emoji.name,
                    role: msg.guild.roles.cache.get(args[2]),
                }).then(_reactionRole => {
                    embed.setTitle("Reaction role created!");
                    embed.setDescription("The reaction role was created successfully!");
                    embed.setColor(config.colors.positive);
                    m.edit(embed);
                }).catch(err => {
                    embed.setColor(config.colors.negative);
                    embed.setTitle("Whoops! Something went wrong!");
                    embed.setDescription("Check console for details.");

                    logger.error(err);
                })
            })
    })
}

module.exports.help = {
    name: "reactionrole",
    description: "Create a reaction role message!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "rr"
    ],
    usage: "reactionrole [messageID] [channelID] [roleID]",
}