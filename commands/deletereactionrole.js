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
    msg.delete();
    if (!args[0]) {
        return msg.channel.send(
            new discord.MessageEmbed()
            .setColor(config.colors.negative)
            .setTitle("You have not specified an arguement")
            .setDescription("You have not given me a message ID, channel ID or role ID!")
            .setTimestamp()
            .setFooter(config.embed.footer)
        );
    }

    const embed = new discord.MessageEmbed()
        .setColor(config.embed.color)
        .setTitle("React with the emoji")
        .setDescription("Please react with the emoji you wish to remove reaction role from")
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

                rr.delete({
                    messageID: args[0],
                    reaction: react.emoji.name
                })
                    .then(_ => {
                        embed.setTitle("Reaction role deleted!");
                        embed.setDescription("The reaction role was deleted successfully!");
                        embed.setColor(config.colors.positive);
                        m.edit(embed);
                    })
                    .catch(err => {
                        embed.setColor(config.colors.negative);
                        embed.setTitle("Whoops! Something went wrong!");
                        embed.setDescription("Check console for details.");
    
                        logger.error(err);
                    })
            })
    })
}

module.exports.help = {
    name: "deletereactionrole",
    description: "Delete a reaction role message!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "drr"
    ],
    usage: "deletereactionrole [messageID]",
}