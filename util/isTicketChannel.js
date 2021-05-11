const discord = require("discord.js");
const db = require("../db");
const logger = require("../logger");

/**
 * Test if a channel is a ticket channel
 * @param {discord.Channel} channel The channel to test
 * @returns {boolean}
 */
module.exports = async (channel) => {
    let ticket;

    try {
        ticket = await db.models.Ticket.findOne({
            where: {
                id: channel.id
            }
        })
    } catch (e) {
        logger.error(e);
        return false
    }

    if (ticket) return true;
    else return false;
}