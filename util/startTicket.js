const discord = require("discord.js");
const logger = require("../logger");
const db = require("../db");
const ticketConfig = require("../storage/ticket.json");
const config = require("../storage/config.json");

/**
 * Initialise a ticket in a given channel
 * @param {discord.Client} Client 
 * @param {discord.TextChannel} channel 
 * @param {number} tier 
 * @param {discord.User} user
 * @param {object} reason
 */
module.exports = async (Client, channel, tier, user, ticketType) => {
    await channel.setName(`${ticketType.channelPrefix}${user.username.slice(0,4)}${user.discriminator}`)

    await channel.setParent(ticketConfig.tiers[tier].category, {
        lockPermissions: false
    });

    await channel.createOverwrite(ticketConfig.tiers[tier].role, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true
    });

    await db.models.Ticket.create({
        id: channel.id,
        user: user.id,
        closed: false,
        subject: ticketType.name,
        tier
    });
    
    const embed = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer)
    .setTitle("Hello, support will get back to you soon.")
    .setDescription(`Reason: ${ticketType.name}`);
    await channel.send(embed);
}
