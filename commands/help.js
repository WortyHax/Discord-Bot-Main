const Discord = require("discord.js");
const pagination = require('discord.js-pagination');
const config = require("../storage/config.json");
const messageUtils = require("../util/messageUtils");
const fs = require('fs');

const acceptbugreport = require("./acceptbugreport");
const acceptSuggestion = require("./acceptSuggestion");
const add = require("./add");
const announce = require("./announce");
const avatar = require("./avatar");
const ban = require("./ban");
const botInfo = require("./botInfo");
const bugreport = require("./bugreport");
const close = require("./close");
const createTicketCreator = require("./createTicketCreator");
const deletereactionrole = require("./deletereactionrole");
const demote = require("./demote");
const denybugreport = require("./denybugreport");
const denySuggestion = require("./denySuggestion");
const down = require("./down");
const downgrade = require("./downgrade");
const gedit = require("./gedit");
const gend = require("./gend");
const greroll = require("./greroll");
const gstart = require("./gstart");
const help = require("./help");
const invites = require("./invites");
const invitestop = require("./invitestop");
const kick = require("./kick");
const lock = require("./lock");
const memberCount = require("./memberCount");
const mute = require("./mute");
const ping = require("./ping");
const poll = require("./poll");
const promote = require("./promote");
const reactionrole = require("./reactionrole");
const reload = require("./reload");
const remove = require("./remove");
const rename = require("./rename");
const restart = require("./restart")
const serverInfo = require("./serverInfo")
const shutdown = require("./shutdown")
const suggest = require("./suggest");
const tempban = require("./tempban");
const tempmute = require("./tempmute");
const unban = require("./unban");
const unlock = require("./unlock");
const unmute = require("./unmute");
const up = require("./up");
const updates = require("./updates");
const warn = require("./warn");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, message, msg, args) => {

    const page1 = new Discord.MessageEmbed()
        .setTitle('Help & Information [Page 1]')
        .setColor(config.embed.color)
        .setDescription(`
        \`<>\`: arg required.
        \`[]\`: arg optional.\n
        **Basic Commands:**
        ➥ \`${config.prefix}${avatar.help.usage}\` - _${avatar.help.description}_
        ➥ \`${config.prefix}${botInfo.help.usage}\` - _${botInfo.help.description}_
        ➥ \`${config.prefix}${serverInfo.help.usage}\` - _${serverInfo.help.description}_
        ➥ \`${config.prefix}${memberCount.help.usage}\` - _${memberCount.help.description}_
        ➥ \`${config.prefix}${help.help.usage}\` - _${help.help.description}_
        ➥ \`${config.prefix}${ping.help.usage}\` - _${ping.help.description}_\n
        **Suggestion and Bugreport:**
        ➥ \`${config.prefix}${suggest.help.usage}\` - _${suggest.help.description}_
        ➥ \`${config.prefix}${acceptSuggestion.help.usage}\` - _${acceptSuggestion.help.description}_
        ➥ \`${config.prefix}${denySuggestion.help.usage}\` - _${denySuggestion.help.description}_\n
        ➥ \`${config.prefix}${bugreport.help.usage}\` - _${bugreport.help.description}_
        ➥ \`${config.prefix}${acceptbugreport.help.usage}\` - _${acceptbugreport.help.description}_
        ➥ \`${config.prefix}${denybugreport.help.usage}\` - _${denybugreport.help.description}_\n
        **End of page 1:**
        *Use the \`arrows\` to go to other pages!*\n
        **Page 1 contents:** \`Basic, Suggestion and Bugreport, Fun\`
        **Page 2 contents:** \`Moderation, Owner\`
        **Page 3 contents:** \`Tickets, Invites, Other\`
        **Page 4 contents:** \`Service Bot\``)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    const page2 = new Discord.MessageEmbed()
        .setTitle('Help & Information [Page 2]')
        .setColor(config.embed.color)
        .setDescription(`
        \`<>\`: arg required.
        \`[]\`: arg optional.\n\n
        **Moderation:**
        ➥ \`${config.prefix}${tempban.help.usage}\` - _${tempban.help.description}_
        ➥ \`${config.prefix}${ban.help.usage}\` - _${ban.help.description}_
        ➥ \`${config.prefix}${unban.help.usage}\` - _${unban.help.description}_
        ➥ \`${config.prefix}${kick.help.usage}\` - _${kick.help.description}_
        ➥ \`${config.prefix}${warn.help.usage}\` - _${warn.help.description}_\n
        ➥ \`${config.prefix}${tempmute.help.usage}\` - _${tempmute.help.description}_
        ➥ \`${config.prefix}${mute.help.usage}\` - _${mute.help.description}_
        ➥ \`${config.prefix}${unmute.help.usage}\` - _${unmute.help.description}_\n
        ➥ \`${config.prefix}${lock.help.usage}\` - _${lock.help.description}_
        ➥ \`${config.prefix}${unlock.help.usage}\` - _${unlock.help.description}_\n
        **Owner:**
        ➥ \`${config.prefix}${restart.help.usage}\` - _${restart.help.description}_
        ➥ \`${config.prefix}${reload.help.usage}\` - _${reload.help.description}_
        ➥ \`${config.prefix}${shutdown.help.usage}\` - _${shutdown.help.description}_\n
        **End of page 2:**
        *Use the \`arrows\` to go to other pages!*\n
        **Page 1 contents:** \`Basic, Suggestion and Bugreport, Fun\`
        **Page 2 contents:** \`Moderation, Owner\`
        **Page 3 contents:** \`Tickets, Invites, Other\`
        **Page 4 contents:** \`Service Bot\``)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    const page3 = new Discord.MessageEmbed()
        .setTitle('Help & Information [Page 3]')
        .setColor(config.embed.color)
        .setDescription(`
        \`<>\`: arg required.
        \`[]\`: arg optional.\n\n
        **Ticket:**
        ➥ \`${config.prefix}${add.help.usage}\` - _${add.help.description}_
        ➥ \`${config.prefix}${remove.help.usage}\` - _${remove.help.description}_
        ➥ \`${config.prefix}${close.help.usage}\` - _${close.help.description}_
        ➥ \`${config.prefix}${rename.help.usage}\` - _${rename.help.description}_
        ➥ \`${config.prefix}${up.help.usage}\` - _${up.help.description}_
        ➥ \`${config.prefix}${down.help.usage}\` - _${down.help.description}_\n
        **Invites:**
        ➥ \`${config.prefix}${invites.help.usage}\` - _${invites.help.description}_
        ➥ \`${config.prefix}${invitestop.help.usage}\` - _${invitestop.help.description}_\n
        **Other:**
        ➥ \`${config.prefix}${announce.help.usage}\` - _${announce.help.description}_
        ➥ \`${config.prefix}${updates.help.usage}\` - _${updates.help.description}_
        ➥ \`${config.prefix}${reactionrole.help.usage}\` - _${reactionrole.help.description}_
        ➥ \`${config.prefix}${deletereactionrole.help.usage}\` - _${deletereactionrole.help.description}_
        ➥ \`${config.prefix}${createTicketCreator.help.usage}\` - _${createTicketCreator.help.description}_
        ➥ \`${config.prefix}${promote.help.usage}\` - _${promote.help.description}_
        ➥ \`${config.prefix}${demote.help.usage}\` - _${demote.help.description}_
        ➥ \`${config.prefix}${downgrade.help.usage}\` - _${downgrade.help.description}_\n
        ➥ \`${config.prefix}${gstart.help.usage}\` - _${gstart.help.description}_
        ➥ \`${config.prefix}${gedit.help.usage}\` - _${gedit.help.description}_
        ➥ \`${config.prefix}${gend.help.usage}\` - _${gend.help.description}_
        ➥ \`${config.prefix}${greroll.help.usage}\` - _${greroll.help.description}_
        ➥ \`${config.prefix}${poll.help.usage}\` - _${poll.help.description}_
        **End of page 3:**
        *Use the \`arrows\` to go to other pages!*\n
        **Page 1 contents:** \`Basic, Suggestion and Bugreport, Fun\`
        **Page 2 contents:** \`Moderation, Owner\`
        **Page 3 contents:** \`Tickets, Invites, Other\`
        **Page 4 contents:** \`Service Bot\``)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

    const page4 = new Discord.MessageEmbed()
        .setTitle('Help & Information [Page 4]')
        .setColor(config.embed.color)
        .setDescription(`
        \`<>\`: arg required.
        \`[]\`: arg optional.\n\n
        **Service Bot:**
        **End of page 4:**
        *Use the \`arrows\` to go to other pages!*\n
        **Page 1 contents:** \`Basic, Suggestion and Bugreport, Fun\`
        **Page 2 contents:** \`Moderation, Owner\`
        **Page 3 contents:** \`Tickets, Invites, Other\`
        **Page 4 contents:** \`Service Bot\``)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(config.embed.footer)
        .setTimestamp()

        const pages = [
                page1,
                page2,
                page3,
                page4
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '600000';

        const deletee = true

        pagination(message, pages, emojiList, timeout, deletee)
}

module.exports.help = {
    name: "help",
    description: "Get a list of commands!",
    permissions: [],
    alias: [],
    usage: "help",
}