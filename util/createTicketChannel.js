/* eslint-disable no-async-promise-executor */
const discord = require("discord.js");
const ticketConfig = require("../storage/ticket.json");
const logger = require("../logger");

/**
 * 
 * @param {discord.Client} Client
 * @param {discord.Guild} guild
 * @param {discord.User} user
 * @return {Promise<discord.TextChannel>}
 */
module.exports = (Client, guild, user) => {
    return new Promise((resolve, reject) => {
        guild.channels.create(`ticket-${user.username.slice(0,4)}${user.discriminator}`, {
            permissionOverwrites: [{
                    id: user.id,
                    allow: [
                        "READ_MESSAGE_HISTORY",
                        "SEND_MESSAGES",
                        "VIEW_CHANNEL"
                    ]
                },
                {
                    id: ticketConfig.supportAdmin,
                    allow: [
                        "READ_MESSAGE_HISTORY",
                        "SEND_MESSAGES",
                        "VIEW_CHANNEL"
                    ]
                },
                {
                    id: guild.roles.everyone.id,
                    deny: [
                        "READ_MESSAGE_HISTORY",
                        "SEND_MESSAGES",
                        "VIEW_CHANNEL"
                    ]
                }
            ],
            topic: user.id,
            type: "text",
        }).then(resolve).catch(reject);
    })

}