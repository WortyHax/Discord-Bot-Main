const logger = require('../logger');
const discord = require('discord.js');
const config = require('../storage/config.json')

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.GuildMember} member 
 */
module.exports.run = (Client, member) => {
    config.roles.newMember.forEach(role => {
        member.roles.add(role).catch(err => {
            logger.error("An error occured while adding a role to a member on join. Is the role ID correct?")
            logger.error(err)
        })
    })
}

module.exports.info = {
    name: "guildMemberAdd"
}
