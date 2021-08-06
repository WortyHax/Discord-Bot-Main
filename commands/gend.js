const giveawaysManager = require('../util/GiveawayManager');
const config = require('../storage/config.json')
const discord = require('discord.js');
const messageUtils = require('../util/messageUtils');
const logger = require('../logger')

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    msg.delete();
    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }

    const g = giveawaysManager.manager.giveaways.find(g => g.messageID == args[0])
    
    if (!g) {
        messageUtils.sendError(msg.channel, this, "Invalid giveaway");
    }

    g.end().then(() => {
        const embed = new discord.MessageEmbed()
        .setColor(config.embed.colors.mainColor)
        .setTimestamp()
        .setTitle("Ended the giveaway!");
        msg.channel.send(embed).then(m => m.delete({timeout: 5000}))
    }).catch(err => {
        logger.error(`An error occured while rerolling a giveaway ${g.messageID}`)
        logger.error(err)
        messageUtils.sendError(msg.channel, this, err.message)
    })
}

module.exports.help = {
    name: "gend",
    description: "Stop a giveaway!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "gstop"
    ],
    usage: "gend [giveawayId]",
}