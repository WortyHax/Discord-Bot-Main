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

    const bugReportObj = await db.models.BugReport.findOne({
        where: {
            msg: args[0]
        }
    });
    
    if (!bugReportObj) {
        return messageUtils.sendError(msg.channel, this, "Bug report not found!");
    }

    const bugReportChannel = msg.guild.channels.cache.get(config.channels.bugreports);
    const bugReportMsg = await bugReportChannel.messages.fetch(args[0]);
    await bugReportMsg.delete();

    
    const suggestor = await msg.guild.members.fetch(bugReportObj.author);
    const embed = new discord.MessageEmbed()
    .setColor(config.colors.positive)
    .setFooter(config.embed.footer)
    .setAuthor("New Bug report accepted!")
    .setTitle(`Bug report from ${suggestor.user.username}`)
    .addField("Reason", reason)
    .setDescription(bugReportObj.description);
    msg.guild.channels.cache.get(config.channels.acceptedBugreports).send(embed);

    await messageUtils.sendDM(msg.guild.member(bugReportObj.author).user, {
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

    bugReportObj.status = true;
    bugReportObj.response = reason;
    bugReportObj.save();
}

module.exports.help = {
    name: "acceptbugreport",
    description: "Accept a bug report.",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "abugreport",
        "acceptBugReport",
        "acceptbr",
    ],
    usage: "acceptBugreport <reportId> [reason]",
}