const discord = require("discord.js");
const db = require("../db");
const isTicketChannel = require("../util/isTicketChannel")
const config = require("../storage/config.json");
const log = require("../util/log");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = async (Client, msg, args) => {
    msg.delete();
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

    await ticket.update({
        closed: true
    });

    await msg.channel.delete(`${msg.channel.name} was closed by ${msg.author.username}`);

    log(msg.guild, "Ticket Closed!", `${msg.channel.name} (${msg.channel.id}) was closed by ${msg.author.username}`);
}

module.exports.help = {
    name: "close",
    description: "Close a ticket!",
    permissions: [],
    alias: [],
    usage: "close",
}