const messageUtils = require('../util/messageUtils');
const db = require('../db');
const { MessageEmbed } = require('discord.js');
const config = require('../storage/config.json')
const logger = require('../logger.js')

const suggest = require("./suggest");

module.exports.run = (Client, msg, args) => {
    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }

    const topic = args.join(" ").slice(5);
    const suggestion = args.join(" ").slice(5);
    
    const embed = new MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(`${config.prefix}${suggest.help.usage} - to create a suggestion.`)
    .setTimestamp()
    .setAuthor(`Suggestion from ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
    .setThumbnail(msg.author.avatarURL({ dynamic: true }))
    .addField(`Suggestion - ${topic}:`, suggestion);

    msg.guild.channels.cache.get(config.channels.suggestions).send(embed).then(async m => {
        await m.react(config.emojis.success);
        await m.react(config.emojis.error);
        db.models.Suggestion.create({
            suggestion,
            status: null,
            msg: m.id,
            author: msg.author.id
        }).catch(logger.error.bind(logger.error))
    }).catch(logger.error.bind(logger.error));
}

module.exports.help = {
    name: "suggest",
    description: "Create a suggestion.",
    permissions: [],
    alias: [
        "suggestion"
    ],
    usage: "suggest <topic> <suggestion>",
}