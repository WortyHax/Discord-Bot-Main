const discord = require('discord.js');
const config = require('../storage/config.json')
const logger = require('../logger')
const messageUtils = require('../util/messageUtils');

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    msg.delete();
    msg.channel.createOverwrite(msg.guild.roles.everyone, {
        SEND_MESSAGES: null
    }).then(_ch => {
        msg.channel.send({
            embed: {
                color: config.colors.positive,
                footer: config.embed.footer,
                title: "Success!",
                description: "Channel has been unlocked!"
            }
        }).then(m => {
            m.delete({timeout: 5000})
        });
    }).catch(err => {
        logger.error(`An error occured while unlocking a channel ${msg.channel.id}`)
        logger.error(err);
        messageUtils.sendError(msg.channel, this, "An error occured. Check console");
    })
}

module.exports.help = {
    name: "unlock",
    description: "Lock a channel so no one can talk in it",
    permissions: [
        "KICK_MEMBERS"
    ],
    alias: [],
    usage: "unlock",
}