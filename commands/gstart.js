const giveawaysManager = require(`../util/GiveawayManager`);
const ms = require(`ms`);
const discord = require(`discord.js`);
const messageUtils = require(`../util/messageUtils`);
const config = require(`../storage/config.json`)
const lang = require(`../storage/lang.json`)

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    msg.delete();
    if (!args[0] || !args[1] || !parseInt(args[1])) {
        return messageUtils.sendSyntaxError(msg.channel, this);
    }

    if (!ms(args[0])) {
        return messageUtils.sendError(msg.channel, this, `${lang.gstart.fail.duration}`)
    }

    const prize = args.slice(2).join(" ");

    giveawaysManager.manager.start(msg.channel, {
        time: ms(args[0]),
        prize,
        winnerCount: parseInt(args[1]),
        messages: {
            giveaway: `🎉🎉 ${lang.gstart.messages.giveaway} 🎉🎉`,
            giveawayEnded: `🎉🎉 ${lang.gstart.messages.giveawayEnded} 🎉🎉`,
            timeRemaining: `${lang.gstart.messages.timeRemaining} \`{duration}\``,
            inviteToParticipate: `${lang.gstart.messages.inviteToParticipate_1} 🎉 ${lang.gstart.messages.inviteToParticipate_2}`,
            winMessage: `${lang.gstart.messages.winMessage}`,
            embedFooter: `${config.embed.footer}`,
            noWinner: `${lang.gstart.messages.noWinner}`,
            hostedBy: `${lang.gstart.messages.hostedBy}`,
            winners: `${lang.gstart.messages.winners}`,
            endedAt: `${lang.gstart.messages.endedAt}`
        }
    })}

module.exports.help = {
    name: "gstart",
    description: "Start a giveaway!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [],
    usage: "gstart [duration] [winners] [prize]",
}