const discord = require("discord.js");
const config = require("../storage/config.json");
const getTotal = require("../util/getTotalInvites")

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = async (Client, msg, args) => {
    const user = args[0] ? msg.guild.member(args[0]).user : msg.author;

    let totalInvites = await getTotal(user, msg.guild);
    
    msg.channel.send({
        embed: {
            color: config.embed.color,
            footer: config.embed.footer,
            title: `Invites`,
            description: `${user} has ${totalInvites} invites.`
        }
    })
}

module.exports.help = {
    name: "invites",
    description: "View yours or someone else's invites!",
    permissions: [],
    alias: [],
    usage: "invites <@user>",
}