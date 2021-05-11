const discord = require("discord.js");
const ticketConfig = require("../storage/ticket.json");
const config = require("../storage/config.json");
const isTicketChannel = require("../util/isTicketChannel");
const db = require("../db");
const log = require("../util/log");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = async (Client, msg, args) => {
    if (!msg.member.roles.cache.has(ticketConfig.supportAdmin)) {
        return msg.channel.send(
            new discord.MessageEmbed()
            .setColor(config.colors.negative)
            .setFooter(config.embed.footer)
            .setTitle("You must be support admin to do this!")
        )
    }

    if (!isTicketChannel(msg.channel)) {
        return msg.channel.send(
            new discord.MessageEmbed({
                ...config.embed
            })
            .setTitle("This is not a ticket channel!")
        )
    }

    const ticket = await db.models.Ticket.findOne({
        where: {
            id: msg.channel.id
        }
    });

    if (ticket.tier == 0) {
        return msg.channel.send(
            new discord.MessageEmbed({
                ...config.embed
            })
            .setTitle("This is the lowest tier!")
        )
    }

    await msg.channel.setParent(ticketConfig.tiers[ticket.tier - 1].category, {
        lockPermissions: false
    })

    await msg.channel.createOverwrite(ticketConfig.tiers[ticket.tier].role, {
        SEND_MESSAGES: null,
        READ_MESSAGE_HISTORY: null,
        VIEW_CHANNEL: null
    });

    await msg.channel.createOverwrite(ticketConfig.tiers[ticket.tier - 1].role, {
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
        VIEW_CHANNEL: true
    });

    await ticket.update({
        tier: ticket.tier - 1
    });

    await msg.delete()

    log(msg.guild, "Ticket moved down!", `${msg.channel} (${msg.channel.id}) has been moved down to tier ${ticket.tier - 1} by ${msg.author} (${msg.author.id})`);
    
}

module.exports.help = {
    name: "down",
    description: "Move a ticket down the important level.",
    permissions: [],
    alias: [],
    usage: "down",
}