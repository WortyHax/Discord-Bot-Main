const discord = require("discord.js");
const logger = require('../logger');
const tickets = require("../storage/ticket.json")
const createTicketChannel = require("../util/createTicketChannel");
const startTicket = require("../util/startTicket");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.MessageReaction} reaction 
 * @param {discord.User} user 
 */
module.exports.run = async (Client, reaction, user) => {
    if (reaction.message.id !== tickets.message) return;
    if (user.bot) return;

    reaction.users.remove(user);

    let ch = await createTicketChannel(Client, reaction.message.guild, user);

    startTicket(Client, ch, 0, user, tickets.types.find(tk => tk.emoji === reaction.emoji.name))

}

module.exports.info = {
    name: "messageReactionAdd"
}