const discord = require("discord.js");
const config = require("../storage/config.json");
const isTicketChannel = require("../util/isTicketChannel");
const log = require("../util/log");
const ticketConfig = require("../storage/ticket.json");

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

    if (!msg.member.roles.cache.has(ticketConfig.supportAdmin)) {
        return msg.channel.send(
            new discord.MessageEmbed({
                ...config.embed
            })
            .setTitle("You must be support admin to do that!")
        )
    }

    let member = msg.guild.member(msg.channel.topic);
    let newName = `${args.join("-")}-${member.user.username.slice(0,4)}${member.user.discriminator}`;

    await msg.channel.setName(newName);

    await msg.delete();

    log(msg.guild, "Channel renamed!", `${msg.channel} (${msg.channel.id}) has been renamed to ${newName} by ${msg.author} (${msg.author.username})`)
}

module.exports.help = {
    name: "rename",
    description: "Rename a ticket!",
    permissions: [],
    alias: [],
    usage: "remove [name]",
}