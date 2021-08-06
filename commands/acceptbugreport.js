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

    let reason = args.slice(1).join(" ");
    if (reason.length <= 0) reason = `${lang.bugreport.accepted.error.no_reason}`;

    const bugReportObj = await db.models.BugReport.findOne({
        where: {
            msg: args[0]
        }
    });
    
    if (!bugReportObj) {
        return messageUtils.sendError(msg.channel, this, `${lang.bugreport.accepted.error.no_bugreport_found} ${args[0]}`);
    }

    const suggester = msg.guild.member(bugReportObj.author);
    const bugReportChannel = msg.guild.channels.cache.get(config.channels.pendingBugReports);
    const bugReportMsg = await bugReportChannel.messages.fetch(args[0]);
    const topic = bugReportObj.topic
    const id = bugReportObj.msg
    await bugReportMsg.delete();

    
    const suggestor = await msg.guild.members.fetch(bugReportObj.author);
    const embed = new discord.MessageEmbed()
    .setColor(config.bugreport.colors.accepted)
    .setFooter(`${lang.bugreport.accepted.accepted_footer_1} ${suggestor.user.username}${lang.bugreport.accepted.accepted_footer_2}`)
    .setTitle(lang.bugreport.accepted.accepted_title)
    .setAuthor(`${lang.bugreport.accepted.accepted_author} ${suggestor.user.username}`, suggester.user.avatarURL({ dynamic: true }))
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.suggestion.accepted.accepted_topic} \`${topic}\`\n${lang.suggestion.accepted.accepted_suggestion}\n\`${bugReportObj.bugreport}\`\n\n${lang.suggestion.accepted.accepted_information}\n${lang.suggestion.accepted.accepted_status_1} \`${lang.suggestion.accepted.accepted_status_2}\`\n\n${lang.bugreport.accepted.accepted_reason}\n${reason}`)

    msg.guild.channels.cache.get(config.channels.acceptedBugReports).send(embed);

    await messageUtils.sendDM(msg.guild.member(bugReportObj.author).user, {
        embed: {
            color: config.bugreport.colors.accepted,
            "thumbnail": {
                "url": config.embed.thumbnail
            },
            footer: {
                "text": `${lang.bugreport.accepted.dm.footer} ${msg.author.username}`,
                "icon_url": `${msg.author.avatarURL({ dynamic: true })}`
            },
            title: `${lang.bugreport.accepted.dm.title}`,
            description: `${lang.bugreport.accepted.dm.description_2}\n\n${lang.bugreport.accepted.dm.description_1}\n${reason}`,
            timestamp: new Date()
        }
    });

    bugReportObj.status = true;
    bugReportObj.response = reason;
    bugReportObj.save();
}

module.exports.help = {
    name: `${config.bugreport.settings.acceptBugReport.command_name}`,
    description: `${config.bugreport.settings.acceptBugReport.command_description}`,
    permissions: [
        `${config.bugreport.settings.acceptBugReport.command_permissions.permission_1}`,
        `${config.bugreport.settings.acceptBugReport.command_permissions.permission_2}`,
        `${config.bugreport.settings.acceptBugReport.command_permissions.permission_3}`,
        `${config.bugreport.settings.acceptBugReport.command_permissions.permission_4}`,
        `${config.bugreport.settings.acceptBugReport.command_permissions.permission_5}`
    ],
    alias: [
        `${config.bugreport.settings.acceptBugReport.command_aliases.alias_1}`,
        `${config.bugreport.settings.acceptBugReport.command_aliases.alias_2}`,
        `${config.bugreport.settings.acceptBugReport.command_aliases.alias_3}`,
        `${config.bugreport.settings.acceptBugReport.command_aliases.alias_4}`
    ],
    usage: `${config.bugreport.settings.acceptBugReport.command_usage}`,
}