const messageUtils = require('../util/messageUtils');
const db = require('../db');
const discord = require('discord.js');
const config = require('../storage/config.json')
const logger = require('../logger.js')

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = async (Client, msg, args) => {
    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }

    const suggestionObj = await db.models.Suggestion.findOne({
        where: {
            msg: args[0]
        }
    });

    let reason = args.slice(1).join(" ");
    if (reason.length <= 0) reason = "No reason";

    if (!suggestionObj) {
        return messageUtils.sendError(msg.channel, this, "Suggestion not found!");
    }

    const suggester = msg.guild.member(suggestionObj.author);
    const suggestionChannel = msg.guild.channels.cache.get(config.channels.suggestions);
    const suggestionMsg = await suggestionChannel.messages.fetch(args[0]);
    
    const suggestor = await msg.guild.members.fetch(suggestionObj.author);
    const embed = new discord.MessageEmbed()
    .setColor(config.colors.negative)
    .setFooter(config.embed.footer)
    .setTitle("New suggestion denied!")
    .setAuthor(`Suggestion from ${suggestor.user.username}`, suggester.user.avatarURL())
    .setThumbnail(suggester.user.avatarURL())
    .setDescription(`${suggestionObj.suggestion}\n\n**Information:**\nStatus: \`Denied\`\n\n*${reason}*`);
    msg.guild.channels.cache.get(config.channels.deniedSuggestions).send(embed);

    await messageUtils.sendDM(msg.guild.member(suggestionObj.author).user, {
        embed: {
            color: config.colors.negative,
            footer: config.colors.negative,
            title: "Your suggestion has been denied!",
            description: "Thank you for your suggestion. After consideration, we have decided that we will not implement this. We try our best to keep the server brilliant, but your suggestion was denied.",
            fields: [
                {
                    name: "Reason",
                    value: reason
                }
            ],
            timestamp: new Date()
        }
    });

    suggestionObj.status = false;
    suggestionObj.response = reason;
    suggestionObj.save();

    suggestionMsg.edit(
        new discord.MessageEmbed()
        .setColor(config.colors.negative)
        .setFooter(config.embed.footer)
        .setDescription(suggestionObj.suggestion)
        .setTimestamp()
        .setAuthor(`Suggestion from ${suggestor.user.username}`, suggester.user.avatarURL())
    );
    suggestionMsg.reactions.removeAll();
}

module.exports.help = {
    name: "denysuggestion",
    description: "Deny a suggestion.",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "dsuggest",
        "denySuggestion"
    ],
    usage: "denySuggestion <suggestionId> [reason]",
}