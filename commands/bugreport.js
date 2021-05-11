const messageUtils = require('../util/messageUtils');
const db = require('../db');
const { MessageEmbed } = require('discord.js');
const config = require('../storage/config.json')
const logger = require('../logger.js')

module.exports.run = (Client, msg, args) => {
    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }

    const report = args.join(" ");
    
    const embed = new MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer)
    .setTimestamp()
    .setAuthor(`New bug report from ${msg.author.username}`, msg.author.avatarURL())
    .setDescription(report);

    msg.guild.channels.cache.get(config.channels.bugreports).send(embed).then(m => {
        db.models.BugReport.create({
            description: report,
            status: null,
            msg: m.id,
            author: msg.author.id
        }).catch(logger.error.bind(logger.error))
    }).catch(logger.error.bind(logger.error));
}

module.exports.help = {
    name: "bugreport",
    description: "Create a bugreport.",
    permissions: [],
    alias: [
        "bug",
        "br"
    ],
    usage: "bugReport <report>",
}