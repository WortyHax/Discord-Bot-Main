const discord = require("discord.js");
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
    if (!isTicketChannel(msg.channel)) {
        return msg.channel.send(new discord.MessageEmbed({...config.embed})
        .setTitle("This is not a ticket channel!"))
    }

    if (!msg.mentions.members.first()) {
        return msg.channel.send(new discord.MessageEmbed({...config.embed})
        .setTitle("No one mentioned to add!"))
    }

    await msg.channel.createOverwrite(msg.mentions.members.first(), {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true
    });

    msg.channel.send(
        new discord.MessageEmbed({...config.embed})
        .setTitle("User added!")
    );

    log(msg.guild, "Member added to ticket!", `${msg.mentions.members.first()} (${msg.mentions.members.first().id}) has been added to ${msg.channel} (${msg.channel.id}) by ${msg.author} (${msg.author.id})`);
}

module.exports.help = {
    name: "add",
    description: "Add someone to the ticket!",
    permissions: [],
    alias: [],
    usage: "add [@user]",
}