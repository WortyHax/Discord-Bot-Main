const logger = require('../logger');
const discord = require('discord.js');
const config = require('../storage/config.json')

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.GuildMember} member 
 */
module.exports.run = (Client, member) => {
    const embed = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer)
    .setTimestamp()
    .setTitle(`:small_blue_diamond: Welcome ${member.user.username} to TropMC Official Discord.`)
    .setDescription(":small_blue_diamond: Server IP | play.tropmc.org\n:small_blue_diamond: Store | store.tropmc.org\n:small_blue_diamond: Website | www.tropmc.org\n\n:small_blue_diamond: Create a ticket in #support if you need any assistance. For further information, check out #announcements");
    member.guild.channels.cache.get(config.channels.welcomeMessages).send(embed);
    config.welcome.addRoles.forEach(role => {
        member.roles.add(role).catch(err => {
            logger.error("An error occured while adding a role to a member on join. Is the role ID correct?")
            logger.error(err)
        })
    })
}

module.exports.info = {
    name: "guildMemberAdd"
}
