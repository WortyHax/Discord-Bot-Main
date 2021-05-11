const discord = require('discord.js');
const db = require("../db");

/**
 * Create a sanction
 * @param {string} type Sanction type from structures/sanctionTypes
 * @param {discord.User} moderator Moderator who has done this sanction
 * @param {discord.User} user User who has been sanctioned
 * @param {discord.Guild} guild The server in which this sanction has happened in
 * @param {string} [reason] The reason for this sanction. Optional
 * @param {Date} [expire] The expiry date for the sanction. Optional
 */
module.exports = (type, moderator, user, guild, reason, expire) => {
    return new Promise((resolve, reject) => {
        db.models.Sanction.create({
            type,
            mod: moderator.id,
            user: user.id,
            reason: reason?reason:null,
            expire: expire?Math.floor(expire.getTime()/1000):null,
            guild: guild.id,
            revoked: false,
        })
            .then(sanction => {
                return resolve(sanction)
            })
            .catch(reject)
    })
}
