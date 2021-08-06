const messageUtils = require('../util/messageUtils');
const db = require('../db');
const discord = require('discord.js');
const config = require('../storage/config.json')
const lang = require('../storage/lang.json')
const emoji = require('../storage/emojis.json')
const logger = require('../logger.js')

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = async (Client, msg, args) => {
    msg.delete();
    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }

    const suggestionObj = await db.models.Suggestion.findOne({
        where: {
            msg: args[0]
        }
    });

    let reason = args.slice(1).join(" ");
    if (reason.length <= 0) reason = `${lang.suggestion.denied.error.no_reason}`;

    if (!suggestionObj) {
        return messageUtils.sendError(msg.channel, this, `${lang.suggestion.denied.error.no_suggestion_found} ${args[0]}`);
    }

    const suggester = msg.guild.member(suggestionObj.author);
    const suggestionChannel = msg.guild.channels.cache.get(config.channels.pendingSuggestions);
    const suggestionMsg = await suggestionChannel.messages.fetch(args[0]);
    const topic = suggestionObj.topic
    const id = suggestionObj.msg
    
    const suggestor = await msg.guild.members.fetch(suggestionObj.author);
    const embed = new discord.MessageEmbed()
    .setColor(config.embed.colors.negative)
    .setFooter(`${lang.suggestion.denied.denied_footer_1} ${suggestor.user.username}${lang.suggestion.denied.denied_footer_2}`, suggester.user.avatarURL({ dynamic: true }))
    .setTitle(`${lang.suggestion.denied.denied_title}`)
    .setAuthor(`${lang.suggestion.denied.denied_author} ${suggestor.user.username}`, suggester.user.avatarURL({ dynamic: true }))
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.suggestion.denied.denied_topic} \`${topic}\`\n${lang.suggestion.denied.denied_suggestion}\n\`${suggestionObj.suggestion}\`\n\n${lang.suggestion.denied.denied_information}\n${lang.suggestion.denied.denied_status_1} \`${lang.suggestion.denied.denied_status_2}\`\n\n${lang.suggestion.denied.denied_reason}\n${reason}`);
    
    msg.guild.channels.cache.get(config.channels.deniedSuggestions).send(embed).then(async m => {

        const logs = new discord.MessageEmbed()
        .setAuthor(`${lang.suggestion.denied.logs.logs_title}`)
        .setColor(config.suggestion.colors.denied)
        .setThumbnail(config.embed.thumbnail)
        .setDescription(`${lang.suggestion.denied.logs.logs_description_1}
        ${lang.suggestion.denied.logs.logs_description_2} <@${suggester.user.id}>
        ${lang.suggestion.denied.logs.logs_description_3} \`${suggester.user.id}\`
        ${lang.suggestion.denied.logs.logs_description_4} <@${msg.author.id}>
        ${lang.suggestion.denied.logs.logs_description_5} \`${reason}\`
        ${lang.suggestion.denied.logs.logs_description_6} \`${id}\`
        ${lang.suggestion.denied.logs.logs_description_7} \`${topic}\`
        ${lang.suggestion.denied.logs.logs_description_8}
        \`${suggestionObj.suggestion}\``)

        msg.guild.channels.cache.get(config.logs.suggestion.suggestion_denied).send(logs)
    })

    await messageUtils.sendDM(msg.guild.member(suggestionObj.author).user, {
        embed: {
            color: config.suggestion.colors.denied,
            "thumbnail": {
                "url": config.embed.thumbnail
            },
            footer: {
                "text": `${lang.suggestion.denied.dm.footer} ${msg.author.username}`,
                "icon_url": `${msg.author.avatarURL({ dynamic: true })}`
            },
            title: `${lang.suggestion.denied.dm.title}`,
            description: `${lang.suggestion.denied.dm.description_2}\n\n${lang.suggestion.denied.dm.description_1}\n${reason}`,
            timestamp: new Date()
        }
    });

    suggestionObj.status = false;
    suggestionObj.response = reason;
    suggestionObj.save();

    suggestionMsg.edit(
        new discord.MessageEmbed()
        .setAuthor(`${lang.suggestion.pending.pending_author} ${suggestor.user.username}`, suggestor.user.avatarURL({ dynamic: true }))
        .setColor(config.suggestion.colors.denied)
        .addField(`${lang.suggestion.pending.pending_topic}`, `\`${topic}\``)
        .addField(`${lang.suggestion.pending.pending_suggestion}`, `\`${suggestionObj.suggestion}\``)
        .addField(`${lang.suggestion.denied.denied_status_1}`, `\`${lang.suggestion.denied.denied_status_2}\``)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(`${lang.suggestion.pending.pending_footer} ${id}`)
        .setTimestamp()
    );
    suggestionMsg.reactions.removeAll();
}

module.exports.help = {
    name: `${config.suggestion.settings.denySuggestion.command_name}`,
    description: `${config.suggestion.settings.denySuggestion.command_description}`,
    permissions: [
        `${config.suggestion.settings.denySuggestion.command_permissions.permission_1}`,
        `${config.suggestion.settings.denySuggestion.command_permissions.permission_2}`,
        `${config.suggestion.settings.denySuggestion.command_permissions.permission_3}`,
        `${config.suggestion.settings.denySuggestion.command_permissions.permission_4}`,
        `${config.suggestion.settings.denySuggestion.command_permissions.permission_5}`
    ],
    alias: [
        `${config.suggestion.settings.denySuggestion.command_aliases.alias_1}`,
        `${config.suggestion.settings.denySuggestion.command_aliases.alias_2}`,
        `${config.suggestion.settings.denySuggestion.command_aliases.alias_3}`,
        `${config.suggestion.settings.denySuggestion.command_aliases.alias_4}`,
        `${config.suggestion.settings.denySuggestion.command_aliases.alias_5}`
    ],
    usage: `${config.suggestion.settings.denySuggestion.command_usage}`,
}