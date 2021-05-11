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

    let reason = args.slice(1).join(" ");
    if (reason.length <= 0) reason = "No reason";

    const suggestionObj = await db.models.Suggestion.findOne({
        where: {
            msg: args[0]
        }
    });
    
    if (!suggestionObj) {
        return messageUtils.sendError(msg.channel, this, "Suggestion not found!");
    }

    const suggester = msg.guild.member(suggestionObj.author);
    const suggestionChannel = msg.guild.channels.cache.get(config.channels.suggestions);
    const suggestionMsg = await suggestionChannel.messages.fetch(args[0]);
    
    const suggestor = await msg.guild.members.fetch(suggestionObj.author);
    const embed = new discord.MessageEmbed()
    .setColor(config.colors.positive)
    .setFooter(config.embed.footer)
    .setTitle("New suggestion accepted!")
    .setAuthor(`Suggestion from ${suggestor.user.username}`, suggester.user.avatarURL())
    .setThumbnail(suggester.user.avatarURL())
    .setDescription(`${suggestionObj.suggestion}\n\n**Information:**\nStatus: \`Accepted\`\n\n*${reason}*`);
    msg.guild.channels.cache.get(config.channels.acceptedSuggestions).send(embed);

    await messageUtils.sendDM(msg.guild.member(suggestionObj.author).user, {
        embed: {
            color: config.colors.positive,
            footer: config.embed.footer,
            title: "Your suggestion has been accepted",
            fields: [
                {
                    name: "Reason",
                    value: reason
                }
            ],
            description: "Thank you for your suggestion. After consideration, we have decided that we will accept this suggestion and implement any necessary changes to implement this. Thanks!",
            timestamp: new Date()
        }
    });

    suggestionObj.status = true;
    suggestionObj.response = reason;
    suggestionObj.save();

    suggestionMsg.edit(
        new discord.MessageEmbed()
        .setColor(config.colors.positive)
        .setFooter(config.embed.footer)
        .setDescription(suggestionObj.suggestion)
        .setTimestamp()
        .setAuthor(`Suggestion from ${suggestor.user.username}`, suggester.user.avatarURL())
    );
    suggestionMsg.reactions.removeAll();
}

module.exports.help = {
    name: "acceptsuggestion",
    description: "Accept a suggestion.",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "asuggest",
        "acceptSuggestion"
    ],
    usage: "acceptSuggestion <suggestionId> [reason]",
}