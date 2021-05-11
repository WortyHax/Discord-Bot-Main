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

    const bugreportObj = await db.models.BugReport.findOne({
        where: {
            msg: args[0]
        }
    });

    let reason = args.slice(1).join(" ");
    if (reason.length <= 0) reason = "No reason";

    if (!bugreportObj) {
        return messageUtils.sendError(msg.channel, this, "Bug report not found!");
    }

    const bugreportsChannel = msg.guild.channels.cache.get(config.channels.bugreports);
    const bugReportMsg = await bugreportsChannel.messages.fetch(args[0]);
    await bugReportMsg.delete();

    
    const suggestor = await msg.guild.members.fetch(bugreportObj.author);
    const embed = new discord.MessageEmbed()
    .setColor(config.colors.negative)
    .setFooter(config.embed.footer)
    .setAuthor("New bug report denied!")
    .setTitle(`Bug report from ${suggestor.user.username}`)
    .addField("Reason", reason)
    .setDescription(bugreportObj.description);
    msg.guild.channels.cache.get(config.channels.deniedBugreports).send(embed);

    await messageUtils.sendDM(msg.guild.member(bugreportObj.author).user, {
        embed: {
            color: config.colors.negative,
            footer: config.colors.negative,
            title: "Your bug report has been denied!",
            description: "Thank you for your bug report. After consideration, we have decided that we will not implement this. We try our best to keep the server brilliant, but your bug report was denied.",
            fields: [
                {
                    name: "Reason",
                    value: reason
                }
            ],
            timestamp: new Date()
        }
    });

    bugreportObj.status = false;
    bugreportObj.response = reason;
    bugreportObj.save();
}

module.exports.help = {
    name: "denybugreport",
    description: "Deny a bug report.",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "dbugreport",
        "denyBugreport",
        "denybr"
    ],
    usage: "denyBugreport <bugreportId> [reason]",
}