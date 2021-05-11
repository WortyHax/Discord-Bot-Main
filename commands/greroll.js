const discord = require('discord.js')
const messageUtils = require('../util/messageUtils');
const giveaways = require('../util/GiveawayManager');
const logger = require('../logger');

module.exports.run = (Client, msg, args) => {
    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this)
    }

    let winners;

    const g = giveaways.manager.giveaways.find(g => g.messageID === args[0])
    
    if (!g) {
        return messageUtils.sendError(msg.channel, this, "Invalid giveaway");
    }
    
    if (args[1] && parseInt(args[1])) {
        winners = parseInt(args[1])
    } else winners = g.winnerCount

    g.reroll({
        winnerCount: winners,
        messages: {
            congrat: ":tada: New winners: {winners}! Congrats!",
            error: "No valid participants could be chosen!"
        }
    }).catch(err => {
        logger.error(`An error occured while rerolling a giveaway ${g.messageID}`)
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