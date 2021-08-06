const discord = require('discord.js')
const messageUtils = require('../util/messageUtils');
const giveaways = require('../util/GiveawayManager');
const config = require(`../storage/config.json`)
const lang = require(`../storage/lang.json`)
const logger = require('../logger');

module.exports.run = (Client, msg, args) => {
    msg.delete();;
    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this)
    }

    let winners;

    const g = giveaways.manager.giveaways.find(g => g.messageID === args[0])
    
    if (!g) {
        return messageUtils.sendError(msg.channel, this, `${lang.greroll.fail.invalid}`);
    }
    
    if (args[1] && parseInt(args[1])) {
        winners = parseInt(args[1])
    } else winners = g.winnerCount

    g.reroll({
        winnerCount: winners,
        messages: {
            congrat: `${lang.greroll.messages.congratulations}`,
            error: `${lang.greroll.messages.error}`
        }
    }).catch(err => {
        logger.error(`${lang.greroll.error.error} ${g.messageID}`)
        logger.error(err)
        messageUtils.sendError(msg.channel, this, err.message)
    })
}

module.exports.help = {
    name: "greroll",
    description: "Reroll giveaway winners!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "grr"
    ],
    usage: "greroll [giveawayId]",
}