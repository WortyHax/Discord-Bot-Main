const messageUtils = require('../util/messageUtils');
const db = require('../db');
const Discord = require('discord.js');
const config = require('../storage/config.json')
const emoji = require('../storage/emojis.json')
const lang = require('../storage/lang.json')
const logger = require('../logger.js')

const br = require("./bugReport");

module.exports.run = (Client, msg, args) => {
    msg.delete();

    const error = new Discord.MessageEmbed()
    .setColor(config.embed.colors.negative)
    .setFooter(`${config.settings.prefix}${br.help.usage} ${lang.bugreport.pending.error.error_footer}`)
    .setTimestamp()
    .setThumbnail(config.embed.thumbnail)
    .setTitle(`${lang.bugreport.pending.error.error_title}`)
    .setDescription(`${lang.bugreport.pending.error.error_description_1}\n\n${lang.bugreport.pending.error.error_description_2} *${config.settings.prefix}${lang.bugreport.pending.error.error_description_3}*\n\n${lang.bugreport.pending.error.error_description_4}\n\u3000${config.bugreport.topics.topic_1}\n\u3000${config.bugreport.topics.topic_2}\n\u3000${config.bugreport.topics.topic_3}\n\u3000${config.bugreport.topics.topic_4}\n\u3000${config.bugreport.topics.topic_5}\n\u3000${config.bugreport.topics.topic_6}\n\u3000${config.bugreport.topics.topic_7}\n\u3000${config.bugreport.topics.topic_8}\n\u3000${config.bugreport.topics.topic_9}\n\u3000${config.bugreport.topics.topic_10}`)

    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }
    let allowedTopics = [config.bugreport.topics.topic_1, config.bugreport.topics.topic_2, config.bugreport.topics.topic_3, config.bugreport.topics.topic_4, config.bugreport.topics.topic_5, config.bugreport.topics.topic_6, config.bugreport.topics.topic_7, config.bugreport.topics.topic_8, config.bugreport.topics.topic_9, config.bugreport.topics.topic_10]; // Move this elsewhere and add more
    const topic = allowedTopics.includes(args[0].toLowerCase()) ? args[0].toLowerCase() : false;
    if(!topic) {
      msg.channel.send(error)
      return;
    }
    const bugreport = topic ? args.slice(1).join(" ") : args.join(" ");
    
    const embed = new Discord.MessageEmbed()
    .setAuthor(`${lang.bugreport.pending.pending_author} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
    .setColor(config.bugreport.colors.pending)
    .addField(`${lang.bugreport.pending.pending_topic}`, `\`${topic}\``)
    .addField(`${lang.bugreport.pending.pending_bugreport}`, `\`${bugreport}\``)
    .setThumbnail(config.bugreport.pending.thumbnail)
    .setFooter(`${lang.bugreport.pending.pending_footer}`)
    .setTimestamp()

    const success = new Discord.MessageEmbed()
    .setAuthor(`${msg.author.username}${lang.bugreport.pending.success.success_author}`, msg.author.avatarURL({ dynamic: true }))
    .setColor(config.embed.colors.positive)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.bugreport.pending.success.success_description_1} <#${config.channels.pendingBugReports}>${lang.bugreport.pending.success.success_description_2}`)
    .setFooter(`${lang.bugreport.pending.success.success_footer}`)
    .setTimestamp()

    msg.guild.channels.cache.get(config.channels.pendingBugReports).send(embed).then(async m => {

        const messages = await msg.guild.channels.cache.get(config.channels.pendingBugReports).messages.fetch({ limit: 1 });
        const lastMessage = messages.last();

        lastMessage.edit(
            new Discord.MessageEmbed()
            .setAuthor(`${lang.bugreport.pending.pending_author} ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
            .setColor(config.bugreport.colors.pending)
            .addField(`${lang.bugreport.pending.pending_topic}`, `\`${topic}\``)
            .addField(`${lang.bugreport.pending.pending_bugreport}`, `\`${bugreport}\``)
            .setThumbnail(config.bugreport.pending.thumbnail)
            .setFooter(`${lang.bugreport.pending.pending_footer} ${m.id}`)
            .setTimestamp()
        );
        await msg.channel.send(success);

        const logs = new Discord.MessageEmbed()
        .setAuthor(`${lang.bugreport.pending.logs.logs_title}`, msg.author.avatarURL({ dynamic: true }))
        .setColor(config.bugreport.colors.pending)
        .setThumbnail(config.embed.thumbnail)
        .setDescription(`${lang.bugreport.pending.logs.logs_description_1}
        ${lang.bugreport.pending.logs.logs_description_2} <@${msg.author.id}>
        ${lang.bugreport.pending.logs.logs_description_3} \`${msg.author.id}\`
        ${lang.bugreport.pending.logs.logs_description_4} \`${m.id}\`
        ${lang.bugreport.pending.logs.logs_description_5} \`${topic}\`
        ${lang.bugreport.pending.logs.logs_description_6}
        \`${bugreport}\``)
        .setTimestamp()

        await msg.guild.channels.cache.get(config.logs.bugreport.bugreport_pending).send(logs)
        await m.react(emoji.thumbsup);
        await m.react(emoji.thumbsdown);

        db.models.BugReport.create({
            bugreport,
            topic,
            status: null,
            msg: m.id,
            author: msg.author.id
        }).catch(logger.error.bind(logger.error))
    }).catch(logger.error.bind(logger.error));
}

module.exports.help = {
    name: `${config.bugreport.settings.bugReport.command_name}`,
    description: `${config.bugreport.settings.bugReport.command_description}`,
    permissions: [],
    alias: [
        `${config.bugreport.settings.bugReport.command_aliases.alias_1}`,
        `${config.bugreport.settings.bugReport.command_aliases.alias_2}`
    ],
    usage: `${config.bugreport.settings.bugReport.command_usage}`,
}