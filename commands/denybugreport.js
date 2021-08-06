const messageUtils = require('../util/messageUtils');
const db = require('../db');
const discord = require('discord.js');
const config = require('../storage/config.json')
const lang = require('../storage/lang.json')
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

    const bugreportObj = await db.models.BugReport.findOne({
        where: {
            msg: args[0]
        }
    });

    let reason = args.slice(1).join(" ");
    if (reason.length <= 0) reason = `${lang.bugreport.denied.error.no_reason}`;

    if (!bugreportObj) {
        return messageUtils.sendError(msg.channel, this, `${lang.bugreport.denied.error.no_bugreport_found} ${args[0]}`);
    }

    const suggester = msg.guild.member(bugreportObj.author);
    const bugreportsChannel = msg.guild.channels.cache.get(config.channels.pendingBugReports);
    const bugReportMsg = await bugreportsChannel.messages.fetch(args[0]);
    const topic = bugreportObj.topic
    const id = bugreportObj.msg
    await bugReportMsg.delete();

    
    const suggestor = await msg.guild.members.fetch(bugreportObj.author);
    const embed = new discord.MessageEmbed()
    .setColor(config.embed.colors.negative)
    .setFooter(`${lang.bugreport.denied.denied_footer_1} ${suggestor.user.username}${lang.suggestion.denied.denied_footer_2}`, suggester.user.avatarURL({ dynamic: true }))
    .setTitle(`${lang.bugreport.denied.denied_title}`)
    .setAuthor(`${lang.suggestion.denied.denied_author} ${suggestor.user.username}`, suggester.user.avatarURL({ dynamic: true }))
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.bugreport.denied.denied_topic} \`${topic}\`\n${lang.bugreport.denied.denied_bugreport}\n\`${bugreportObj.bugreport}\`\n\n${lang.bugreport.denied.denied_information}\n${lang.bugreport.denied.denied_status_1} \`${lang.bugreport.denied.denied_status_2}\`\n\n${lang.bugreport.denied.denied_reason}\n${reason}`);
    
    msg.guild.channels.cache.get(config.channels.deniedBugReports).send(embed).then(async m => {
        
        const logs = new discord.MessageEmbed()
        .setAuthor(`${lang.bugreport.denied.logs.logs_title}`)
        .setColor(config.bugreport.colors.denied)
        .setThumbnail(config.embed.thumbnail)
        .setDescription(`${lang.bugreport.denied.logs.logs_description_1}
        ${lang.bugreport.denied.logs.logs_description_2} <@${suggester.user.id}>
        ${lang.bugreport.denied.logs.logs_description_3} \`${suggester.user.id}\`
        ${lang.bugreport.denied.logs.logs_description_4} <@${msg.author.id}>
        ${lang.bugreport.denied.logs.logs_description_5} \`${reason}\`
        ${lang.bugreport.denied.logs.logs_description_6} \`${id}\`
        ${lang.bugreport.denied.logs.logs_description_7} \`${topic}\`
        ${lang.bugreport.denied.logs.logs_description_8}
        \`${bugreportObj.bugreport}\``)

        msg.guild.channels.cache.get(config.logs.bugreport.bugreport_denied).send(logs)
    })

    await messageUtils.sendDM(msg.guild.member(bugreportObj.author).user, {
        embed: {
            color: config.bugreport.colors.denied,
            "thumbnail": {
                "url": config.embed.thumbnail
            },
            footer: {
                "text": `${lang.bugreport.denied.dm.footer} ${msg.author.username}`,
                "icon_url": `${msg.author.avatarURL({ dynamic: true })}`
            },
            title: `${lang.bugreport.denied.dm.title}`,
            description: `${lang.bugreport.denied.dm.description_2}\n\n${lang.bugreport.denied.dm.description_1}\n${reason}`,
            timestamp: new Date()
        }
    });

    bugreportObj.status = false;
    bugreportObj.response = reason;
    bugreportObj.save();
}

module.exports.help = {
    name: `${config.bugreport.settings.denyBugReport.command_name}`,
    description: `${config.bugreport.settings.denyBugReport.command_description}`,
    permissions: [
        `${config.bugreport.settings.denyBugReport.command_permissions.permission_1}`,
        `${config.bugreport.settings.denyBugReport.command_permissions.permission_2}`,
        `${config.bugreport.settings.denyBugReport.command_permissions.permission_3}`,
        `${config.bugreport.settings.denyBugReport.command_permissions.permission_4}`,
        `${config.bugreport.settings.denyBugReport.command_permissions.permission_5}`
    ],
    alias: [
        `${config.bugreport.settings.denyBugReport.command_aliases.alias_1}`,
        `${config.bugreport.settings.denyBugReport.command_aliases.alias_2}`,
        `${config.bugreport.settings.denyBugReport.command_aliases.alias_3}`,
        `${config.bugreport.settings.denyBugReport.command_aliases.alias_4}`
    ],
    usage: `${config.bugreport.settings.denyBugReport.command_usage}`,
}