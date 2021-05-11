const giveawaysManager = require('../util/GiveawayManager');
const ms = require('ms');
const discord = require('discord.js');
const messageUtils = require('../util/messageUtils');

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    if (!args[0] || !args[1] || !parseInt(args[1])) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }

    if (!ms(args[0])) {
        return messageUtils.sendError(msg.channel, this, "Invalid duration")
    }

    const prize = args.slice(2).join(" ");

    giveawaysManager.manager.start(msg.channel, {
        time: ms(args[0]),
        prize,
        winnerCount: parseInt(args[1]),
    });
}

module.exports.help = {
    name: "gstart",
    description: "Start a giveaway!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [],
    usage: "gstart [duration] [winners] [prize]",
}