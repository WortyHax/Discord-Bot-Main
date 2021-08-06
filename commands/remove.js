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
    msg.delete();
    if (!isTicketChannel(msg.channel)) {
        return msg.channel.send(new discord.MessageEmbed({...config.embed})
        .setTitle("This is not a ticket channel!"))
    }

    if (!msg.mentions.members.first()) {
        return msg.channel.send(new discord.MessageEmbed({...config.embed})
        .setTitle("No one mentioned to remove!"))
    }

    await msg.channel.createOverwrite(msg.mentions.members.first(), {
        SEND_MESSAGES: null,
        VIEW_CHANNEL: null,
        READ_MESSAGE_HISTORY: null
    });

    msg.channel.send(
        new discord.MessageEmbed({...config.embed})
        .setTitle("User removed!")
    );

    log(msg.guild, "Member removed from ticket!", `${msg.mentions.members.first()} (${msg.mentions.members.first().id}) has been removed from ${msg.channel} (${msg.channel.id}) by ${msg.author} (${msg.author.id})`);
}

module.exports.help = {
    name: "remove",
    description: "Remove someone from the ticket!",
    permissions: [],
    alias: [],
    usage: "remove [@user]",
}