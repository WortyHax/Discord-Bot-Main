const messageUtils = require('../util/messageUtils');
const db = require('../db');
const { MessageEmbed } = require('discord.js');
const config = require('../storage/config.json')
const logger = require('../logger.js')

const suggest = require("./suggest");

module.exports.run = async (Client, msg, args) => {

    const error = new MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(`${config.prefix}${suggest.help.usage} - to create a suggestion.`)
    .setTimestamp()
    .setTitle("Suggestion Creation")
    .setDescription(`Please put a valid topic!\n\n**Example:** *${config.prefix}suggest Discord Add more voice channels*\n\n**Topics:**\n\u3000${config.suggestion.suggestion_topics.topic_1}\n\u3000${config.suggestion.suggestion_topics.topic_2}\n\u3000${config.suggestion.suggestion_topics.topic_3}\n\u3000${config.suggestion.suggestion_topics.topic_4}\n\u3000${config.suggestion.suggestion_topics.topic_5}\n\u3000${config.suggestion.suggestion_topics.topic_6}\n\u3000${config.suggestion.suggestion_topics.topic_7}\n\u3000${config.suggestion.suggestion_topics.topic_8}\n\u3000${config.suggestion.suggestion_topics.topic_9}\n\u3000${config.suggestion.suggestion_topics.topic_10}`)

    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }
    let allowedTopics = [config.suggestion.suggestion_topics.topic_1, config.suggestion.suggestion_topics.topic_2, config.suggestion.suggestion_topics.topic_3, config.suggestion.suggestion_topics.topic_4, config.suggestion.suggestion_topics.topic_5, config.suggestion.suggestion_topics.topic_6, config.suggestion.suggestion_topics.topic_7, config.suggestion.suggestion_topics.topic_8, config.suggestion.suggestion_topics.topic_9, config.suggestion.suggestion_topics.topic_10]; // Move this elsewhere and add more
    const topic = allowedTopics.includes(args[0].toLowerCase()) ? args[0].toLowerCase() : false;
    if(!topic) {
      msg.channel.send(error)
      return;
    }
    const suggestion = topic ? args.slice(1).join(" ") : args.join(" ");
    
    const embed = new MessageEmbed()
    .setColor(config.suggestion.suggestion_colors.pending)
    .setFooter(`Suggestion ID:`)
    .setTimestamp()
    .setAuthor(`Suggestion from ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
    .setThumbnail(config.suggestion.pendingSuggestions.thumbnail)
    .setDescription(`**Topic:** \`${topic}\`\n\n**Suggestion:**\n\`${suggestion}\``)

    const success = new MessageEmbed()
    .setAuthor(`${msg.author.username}'s suggestion was posted!`, msg.author.avatarURL({ dynamic: true }))
    .setColor(config.embed.color)
    .setDescription(`Your suggestion was successfully posted in <#${config.suggestion.pendingSuggestions.channel}>.`)
    .setFooter(`Suggestion Created!`)
    .setTimestamp()

    msg.guild.channels.cache.get(config.suggestion.pendingSuggestions.channel).send(embed).then(async m => {

        const messages = await msg.guild.channels.cache.get(config.suggestion.pendingSuggestions.channel).messages.fetch({ limit: 1 });
        const lastMessage = messages.last();

        lastMessage.edit(
            new MessageEmbed()
            .setAuthor(`Suggestion from ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
            .setColor(config.suggestion.suggestion_colors.pending)
            .addField("Topic:", `\`${topic}\``)
            .addField("Suggestion:", `\`${suggestion}\``)
            .setThumbnail(config.suggestion.pendingSuggestions.thumbnail)
            .setFooter(`Suggestion ID: ${m.id}`)
            .setTimestamp()
        );
        await msg.channel.send(success);
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