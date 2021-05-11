/* eslint-disable no-async-promise-executor */
const discord = require("discord.js");

/**
 * Get total invites for a user
 * @param {discord.User} user 
 * @param {discord.Guild} guild
 * @returns {Number}
 */
module.exports = (user, guild) => {
    return new Promise(async (resolve, reject) => {
        let total = 0;
        const invites = await guild.fetchInvites()
    
        const invs = [...invites.filter(inv => inv.inviter.id === user.id).values()];
        for (let i = 0; i < invs.length; i++) {
            total = total + invs[i].uses;
        }
    
        return resolve(total);
    })
}