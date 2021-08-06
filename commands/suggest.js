const messageUtils = require('../util/messageUtils');
const db = require('../db');
const Discord = require('discord.js');
const config = require('../storage/config.json')
const emoji = require('../storage/emojis.json')
const lang = require('../storage/lang.json')
const logger = require('../logger.js')

const suggest = require("./suggest");

module.exports.run = async (Client, msg, args) => {
    msg.delete();

    const error = new Discord.MessageEmbed()
    .setColor(config.embed.colors.negative)
    .setFooter(`${config.settings.prefix}${suggest.help.usage} ${lang.suggestion.pending.error.error_footer}`)
    .setTimestamp()
    .setThumbnail(config.embed.thumbnail)
    .setTitle(`${lang.suggestion.pending.error.error_title}`)
    .setDescription(`${lang.suggestion.pending.error.error_description_1}\n\n${lang.suggestion.pending.error.error_description_2} *${config.settings.prefix}${lang.suggestion.pending.error.error_description_3}*\n\n${lang.suggestion.pending.error.error_description_4}\n\u3000${config.suggestion.topics.topic_1}\n\u3000${config.suggestion.topics.topic_2}\n\u3000${config.suggestion.topics.topic_3}\n\u3000${config.suggestion.topics.topic_4}\n\u3000${config.suggestion.topics.topic_5}\n\u3000${config.suggestion.topics.topic_6}\n\u3000${config.suggestion.topics.topic_7}\n\u3000${config.suggestion.topics.topic_8}\n\u3000${config.suggestion.topics.topic_9}\n\u3000${config.suggestion.topics.topic_10}`)

    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }
    let allowedTopics = [config.suggestion.topics.topic_1, config.suggestion.topics.topic_2, config.suggestion.topics.topic_3, config.suggestion.topics.topic_4, config.suggestion.topics.topic_5, config.suggestion.topics.topic_6, config.suggestion.topics.topic_7, config.suggestion.topics.topic_8, config.suggestion.topics.topic_9, config.suggestion.topics.topic_10]; // Move this elsewhere and add more
    const topic = allowedTopics.includes(args[0].toLowerCase()) ? args[0].toLowerCase() : false;
    if(!topic) {
      msg.channel.send(error)
      return;
    }
    const suggestion = topic ? args.slice(1).join(" ") : args.join(" ");
    
    const embed = new Discord.MessageEmbed()
    .setAuthor(`${lang.suggestion.pending.pending_author} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
    .setColor(config.suggestion.colors.pending)
    .addField(`${lang.suggestion.pending.pending_topic}`, `\`${topic}\``)
    .addField(`${lang.suggestion.pending.pending_suggestion}`, `\`${suggestion}\``)
    .setThumbnail(config.suggestion.pending.thumbnail)
    .setFooter(`${lang.suggestion.pending.pending_footer}`)
    .setTimestamp()

    const success = new Discord.MessageEmbed()
    .setAuthor(`${msg.author.username}${lang.suggestion.pending.success.success_author}`, msg.author.avatarURL({ dynamic: true }))
    .setColor(config.embed.colors.positive)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.suggestion.pending.success.success_description_1} <#${config.channels.pendingSuggestions}>${lang.suggestion.pending.success.success_description_2}`)
    .setFooter(`${lang.suggestion.pending.success.success_footer}`)
    .setTimestamp()

    msg.guild.channels.cache.get(config.channels.pendingSuggestions).send(embed).then(async m => {

        const messages = await msg.guild.channels.cache.get(config.channels.pendingSuggestions).messages.fetch({ limit: 1 });
        const lastMessage = messages.last();

        lastMessage.edit(
            new Discord.MessageEmbed()
            .setAuthor(`${lang.suggestion.pending.pending_author} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
            .setColor(config.suggestion.colors.pending)
            .addField(`${lang.suggestion.pending.pending_topic}`, `\`${topic}\``)
            .addField(`${lang.suggestion.pending.pending_suggestion}`, `\`${suggestion}\``)
            .setThumbnail(config.suggestion.pending.thumbnail)
            .setFooter(`${lang.suggestion.pending.pending_footer} ${m.id}`)
            .setTimestamp()
        );
        await msg.channel.send(success);

        const logs = new Discord.MessageEmbed()
        .setAuthor(`${lang.suggestion.pending.logs.logs_title}`, msg.author.avatarURL({ dynamic: true }))
        .setColor(config.suggestion.colors.pending)
        .setThumbnail(config.embed.thumbnail)
        .setDescription(`${lang.suggestion.pending.logs.logs_description_1}
        ${lang.suggestion.pending.logs.logs_description_2} <@${msg.author.id}>
        ${lang.suggestion.pending.logs.logs_description_3} \`${msg.author.id}\`
        ${lang.suggestion.pending.logs.logs_description_4} \`${m.id}\`
        ${lang.suggestion.pending.logs.logs_description_5} \`${topic}\`
        ${lang.suggestion.pending.logs.logs_description_6}
        \`${suggestion}\``)
        .setTimestamp()

        await msg.guild.channels.cache.get(config.logs.suggestion.suggestion_pending).send(logs)
        await m.react(emoji.thumbsup);
        await m.react(emoji.thumbsdown);

        db.models.Suggestion.create({
            suggestion,
            topic,
            status: null,
            msg: m.id,
            author: msg.author.id
        }).catch(logger.error.bind(logger.error))
    }).catch(logger.error.bind(logger.error));
}

module.exports.help = {
    name: `${config.suggestion.settings.suggest.command_name}`,
    description: `${config.suggestion.settings.suggest.command_description}`,
    permissions: [],
    alias: [
        `${config.suggestion.settings.suggest.command_aliases.alias_1}`,
        `${config.suggestion.settings.suggest.command_aliases.alias_2}`,
        `${config.suggestion.settings.suggest.command_aliases.alias_3}`
    ],
    usage: `${config.suggestion.settings.suggest.command_usage}`,
}