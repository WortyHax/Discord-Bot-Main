const discord = require("discord.js");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json")
const getTotal = require("../util/getTotalInvites")

const inviteTop = require("./invitestop")

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = async (Client, msg, args) => {
    msg.delete();

    let user = msg.mentions.users.first() || msg.author
    let invites = await msg.guild.fetchInvites();
    let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id)

    const noInvites = new discord.MessageEmbed()
    .setAuthor(`${Client.users.cache.get(user.id).tag}${lang.invite_tracker.invite_check.check_author}`, Client.users.cache.get(user.id).displayAvatarURL(({ dynamic : true })))
    .setDescription(`${Client.users.cache.get(user.id)} ${lang.invite_tracker.invite_check.check_description_1} \`0\` ${lang.invite_tracker.invite_check.check_description_2}`)
    .setColor(config.embed.colors.mainColor)
    .setFooter(`${lang.invite_tracker.invite_check.check_footer_1} ${inviteTop.help.usage} ${lang.invite_tracker.invite_check.check_footer_2}`)
    .setTimestamp()

    if (userInv.size <= 0) {
        return msg.channel.send(noInvites)
    }

    let i = 0;
    userInv.forEach(inv => i += inv.uses)

    const gotInvites = new discord.MessageEmbed()
    .setAuthor(`${Client.users.cache.get(user.id).tag}${lang.invite_tracker.invite_check.check_author}`, Client.users.cache.get(user.id).displayAvatarURL(({ dynamic : true })))
    .setDescription(`${Client.users.cache.get(user.id)} ${lang.invite_tracker.invite_check.check_description_1} \`${i}\` ${lang.invite_tracker.invite_check.check_description_2}`)
    .setColor(config.embed.colors.mainColor)
    .setFooter(`${lang.invite_tracker.invite_check.check_footer_1} ${inviteTop.help.usage} ${lang.invite_tracker.invite_check.check_footer_2}`)
    .setTimestamp()
    msg.channel.send(gotInvites)
}

module.exports.help = {
    name: `${config.invite_tracker.invite_check.command_name}`,
    description: `${config.invite_tracker.invite_check.command_description}`,
    permissions: [],
    alias: [
            `${config.invite_tracker.invite_check.command_aliases.alias_1}`,
            `${config.invite_tracker.invite_check.command_aliases.alias_2}`
    ],
    usage: `${config.invite_tracker.invite_check.command_usage}`,
}