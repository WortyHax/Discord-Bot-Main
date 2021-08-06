const discord = require("discord.js");
const pagination = require('discord.js-pagination');
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");
const emojis = require("../storage/emojis.json");
const messageUtils = require("../util/messageUtils");
const fs = require('fs');

const acceptbugreport = require("./acceptBugReport");
const acceptSuggestion = require("./acceptSuggestion");
const add = require("./add");
const announce = require("./announce");
const avatar = require("./avatar");
const ban = require("./ban");
const botInfo = require("./botInfo");
const bugreport = require("./bugReport");
const close = require("./close");
const createTicketCreator = require("./createTicketCreator");
const deletereactionrole = require("./deleteReactionRole");
const demote = require("./demote");
const denybugreport = require("./denyBugReport");
const denySuggestion = require("./denySuggestion");
const down = require("./down");
const downgrade = require("./downgrade");
const emoji = require("./emojis");
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
const reactionRole = require("./reactionRole");
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
module.exports.run = (Client, msg, args) => {
    msg.delete();

    let cmds = ``;
    let adminCmds = ``;
    const embed1 = new discord.MessageEmbed()
    .setTitle(`${lang.help.help_command.valid_commands.command_title}`)

    Client.commands.filter(cmd => cmd.help.permissions.length == 0).forEach(cmd => {
        // if no permissions required
        if (cmd.help.permissions.length == 0) return cmds += `${cmd.help.name} - ${cmd.help.description}\n`;
    })

    Client.commands.filter(cmd => cmd.help.permissions.length > 0).forEach(cmd => {
        for (let i = 0; i < cmd.help.permissions.length; i++) {
            if (msg.member.hasPermission(cmd.help.permissions[i]))
                return adminCmds += `${cmd.help.name} - ${cmd.help.description}\n`;
            else continue;
        }
    })

    embed1.addField("Normal Commands", cmds);
    adminCmds.length > 0 ? embed1.addField("Admin Commands", adminCmds) : null;

    if (args[0]) {
        let cmd = Client.commands.get(args[0]) || Client.commands.get(Client.aliases.get(args[0]));
        
        msg.channel.send(embed1)
        const embed = new discord.MessageEmbed()
            .setColor(config.embed.colors.mainColor)
            .setTitle(`${lang.help.help_command.command_info.info_title} \`${cmd.help.name}\``)
            .setAuthor(`${lang.help.help_command.command_info.info_author}`)
            .setDescription(cmd.help.description)
            .addFields([{
                    name: `${lang.help.help_command.command_info.info_fields.info_field_1}`,
                    value: cmd.help.usage,
                },
                {
                    name: `${lang.help.help_command.command_info.info_fields.info_field_2}`,
                    value: cmd.help.alias.join(", ").length > 0 ? cmd.help.alias.join(", ") : `${lang.help.help_command.command_info.info_fields.info_no_aliases}`,
                },
                {
                    name: `${lang.help.help_command.command_info.info_fields.info_field_3}`,
                    value: cmd.help.permissions.length > 0 ? cmd.help.permissions.join(", ") : `${lang.help.help_command.command_info.info_fields.info_no_permission}`,
                },
            ]);
        return msg.channel.send(embed);
    }
    const embed = new discord.MessageEmbed()
        .setTitle(`${lang.help.help_command.help_panel.help_page_1.page_1_title}`)
        .setColor(config.embed.colors.mainColor)
        .setDescription(`
        \`${lang.help.help_command.help_panel.all_pages.arg_required_1}\`${lang.help.help_command.help_panel.all_pages.arg_required_2}
        \`${lang.help.help_command.help_panel.all_pages.arg_optional_1}\`${lang.help.help_command.help_panel.all_pages.arg_optional_2}\n
        ${lang.help.help_command.help_panel.help_page_1.page_1_description_1}
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${avatar.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${avatar.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${botInfo.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${botInfo.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${serverInfo.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${serverInfo.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${memberCount.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${memberCount.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${help.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${help.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${ping.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${ping.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${emoji.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${emoji.help.description}_\n
        ${lang.help.help_command.help_panel.help_page_1.page_1_description_2}
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${suggest.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${suggest.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${acceptSuggestion.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${acceptSuggestion.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${denySuggestion.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${denySuggestion.help.description}_\n
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${bugreport.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${bugreport.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${acceptbugreport.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${acceptbugreport.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${denybugreport.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${denybugreport.help.description}_\n
        ${lang.help.help_command.help_panel.help_page_1.page_1_description_3}
        Coming Soon!\n
        ${lang.help.help_command.help_panel.help_page_1.end_of_page_1}
        *${lang.help.help_command.help_panel.all_pages.arrows_1} \`${lang.help.help_command.help_panel.all_pages.arrows_2}\` ${lang.help.help_command.help_panel.all_pages.arrows_3}*\n
        ${lang.help.help_command.help_panel.all_pages.page_1_contents} \`${lang.help.help_command.help_panel.all_pages.page_1_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_2_contents} \`${lang.help.help_command.help_panel.all_pages.page_2_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_3_contents} \`${lang.help.help_command.help_panel.all_pages.page_3_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_4_contents} \`${lang.help.help_command.help_panel.all_pages.page_4_contents_text}\``)
        .setThumbnail(config.embed.thumbnail)
        .setTimestamp()

    const embed2 = new discord.MessageEmbed()
        .setTitle(`${lang.help.help_command.help_panel.help_page_2.page_2_title}`)
        .setColor(config.embed.colors.mainColor)
        .setDescription(`
        \`${lang.help.help_command.help_panel.all_pages.arg_required_1}\`${lang.help.help_command.help_panel.all_pages.arg_required_2}
        \`${lang.help.help_command.help_panel.all_pages.arg_optional_1}\`${lang.help.help_command.help_panel.all_pages.arg_optional_2}\n
        ${lang.help.help_command.help_panel.help_page_2.page_2_description_1}
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${tempban.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${tempban.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${ban.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${ban.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${unban.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${unban.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${kick.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${kick.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${warn.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${warn.help.description}_\n
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${tempmute.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${tempmute.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${mute.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${mute.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${unmute.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${unmute.help.description}_\n
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${lock.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lock.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${unlock.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${unlock.help.description}_\n
        ${lang.help.help_command.help_panel.help_page_2.page_2_description_2}
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${restart.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${restart.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${reload.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${reload.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${shutdown.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${shutdown.help.description}_\n
        ${lang.help.help_command.help_panel.help_page_2.end_of_page_2}
        *${lang.help.help_command.help_panel.all_pages.arrows_1} \`${lang.help.help_command.help_panel.all_pages.arrows_2}\` ${lang.help.help_command.help_panel.all_pages.arrows_3}*\n
        ${lang.help.help_command.help_panel.all_pages.page_1_contents} \`${lang.help.help_command.help_panel.all_pages.page_1_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_2_contents} \`${lang.help.help_command.help_panel.all_pages.page_2_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_3_contents} \`${lang.help.help_command.help_panel.all_pages.page_3_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_4_contents} \`${lang.help.help_command.help_panel.all_pages.page_4_contents_text}\``)
        .setThumbnail(config.embed.thumbnail)
        .setTimestamp()

    const embed3 = new discord.MessageEmbed()
        .setTitle(`${lang.help.help_command.help_panel.help_page_3.page_3_title}`)
        .setColor(config.embed.colors.mainColor)
        .setDescription(`
        \`${lang.help.help_command.help_panel.all_pages.arg_required_1}\`${lang.help.help_command.help_panel.all_pages.arg_required_2}
        \`${lang.help.help_command.help_panel.all_pages.arg_optional_1}\`${lang.help.help_command.help_panel.all_pages.arg_optional_2}\n
        ${lang.help.help_command.help_panel.help_page_3.page_3_description_1}
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${add.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${add.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${remove.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${remove.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${close.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${close.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${rename.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${rename.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${up.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${up.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${down.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${down.help.description}_\n
        ${lang.help.help_command.help_panel.help_page_3.page_3_description_2}
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${invites.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${invites.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${invitestop.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${invitestop.help.description}_\n
        ${lang.help.help_command.help_panel.help_page_3.page_3_description_3}
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${announce.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${announce.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${updates.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${updates.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${reactionRole.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${reactionRole.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${deletereactionrole.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${deletereactionrole.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${createTicketCreator.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${createTicketCreator.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${promote.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${promote.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${demote.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${demote.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${downgrade.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${downgrade.help.description}_\n
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${gstart.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${gstart.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${gedit.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${gedit.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${gend.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${gend.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${greroll.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${greroll.help.description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${config.settings.prefix}${poll.help.usage}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${poll.help.description}_
        ${lang.help.help_command.help_panel.help_page_3.end_of_page_3}
        *${lang.help.help_command.help_panel.all_pages.arrows_1} \`${lang.help.help_command.help_panel.all_pages.arrows_2}\` ${lang.help.help_command.help_panel.all_pages.arrows_3}*\n
        ${lang.help.help_command.help_panel.all_pages.page_1_contents} \`${lang.help.help_command.help_panel.all_pages.page_1_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_2_contents} \`${lang.help.help_command.help_panel.all_pages.page_2_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_3_contents} \`${lang.help.help_command.help_panel.all_pages.page_3_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_4_contents} \`${lang.help.help_command.help_panel.all_pages.page_4_contents_text}\``)
        .setThumbnail(config.embed.thumbnail)
        .setTimestamp()

    const embed4 = new discord.MessageEmbed()
        .setTitle(`${lang.help.help_command.help_panel.help_page_4.page_4_title}`)
        .setColor(config.embed.colors.mainColor)
        .setDescription(`
        \`${lang.help.help_command.help_panel.all_pages.arg_required_1}\`${lang.help.help_command.help_panel.all_pages.arg_required_2}
        \`${lang.help.help_command.help_panel.all_pages.arg_optional_1}\`${lang.help.help_command.help_panel.all_pages.arg_optional_2}\n
        ${lang.help.help_command.help_panel.help_page_4.page_4_description_1}
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.add}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.add_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.remove}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.remove_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.ticketPanel}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.ticketPanel_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.stop}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.stop_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.promote}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.promote_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.demote}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.demote_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.freelancerInfo}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.freelancerInfo_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.quote}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.quote_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.review}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.review_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.invoice}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.invoice_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.permissions}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.permissions_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.permissionsAdd}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.permissionsAdd_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.permissionsRemove}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.permissionsRemove_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.portfolio}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.portfolio_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.portfolioAdd}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.portfolioAdd_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.portfolioRemove}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.portfolioRemove_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.set}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.set_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.setRoles}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.setRoles_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.setCategory}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.setCategory_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.setCategory}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.setChannel_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.close}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.close_description}_
        ${lang.help.help_command.help_panel.all_pages.new_command_line} \`${lang.help.help_command.help_panel.help_page_4.service_bot_prefix}${lang.help.help_command.help_panel.help_page_4.service_commands.offers}\` ${lang.help.help_command.help_panel.all_pages.seperate_command} _${lang.help.help_command.help_panel.help_page_4.service_commands.offers_description}_\n
        ${lang.help.help_command.help_panel.help_page_4.end_of_page_4}
        *${lang.help.help_command.help_panel.all_pages.arrows_1} \`${lang.help.help_command.help_panel.all_pages.arrows_2}\` ${lang.help.help_command.help_panel.all_pages.arrows_3}*\n
        ${lang.help.help_command.help_panel.all_pages.page_1_contents} \`${lang.help.help_command.help_panel.all_pages.page_1_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_2_contents} \`${lang.help.help_command.help_panel.all_pages.page_2_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_3_contents} \`${lang.help.help_command.help_panel.all_pages.page_3_contents_text}\`
        ${lang.help.help_command.help_panel.all_pages.page_4_contents} \`${lang.help.help_command.help_panel.all_pages.page_4_contents_text}\``)
        .setThumbnail(config.embed.thumbnail)
        .setTimestamp()

        const pages = [
                embed,
                embed2,
                embed3,
                embed4
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '600000';

        const deletee = true

        pagination(msg, pages, emojiList, timeout, deletee)
}

module.exports.help = {
    name: `${config.help.command_name}`,
    description: `${config.help.command_description}`,
    permissions: [],
    alias: [
            `${config.help.command_aliases.alias_1}`
    ],
    usage: `${config.help.command_usage}`,
}