const discord = require("discord.js");
const _ = require("lodash");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");
const getTotal = require("../util/getTotalInvites")

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
    })
}

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    msg.delete();
    msg.guild.fetchInvites().then(async invites => {
        let invs = [...invites.sort((a, b) => b.uses - a.uses).values()];

        let users = [...removeDuplicates(invs, 'inviter').slice(0, 10)].map(x => x.inviter);
        
        let top = ``;
        
        for (let i = 0; i < users.length; i++) {
            const total = await getTotal(users[i], msg.guild);
            if (total == 0) continue;
            top += `${users[i]} - ${total}\n`;
        }
        
        msg.channel.send({
            embed: {
                color: config.embed.colors.mainColor,
                footer: {
                    text: `${lang.invite_tracker.invite_top.top_footer} ${msg.author.username}`,
                    icon_url: msg.author.avatarURL({ dynamic: true })
                },
                title: `${lang.invite_tracker.invite_top.top_title}`,
                description: `${top}\n${lang.invite_tracker.invite_top.top_description}`
            }
        });
    })
}

module.exports.help = {
    name: `${config.invite_tracker.invite_top.command_name}`,
    description: `${config.invite_tracker.invite_top.command_description}`,
    permissions: [],
    alias: [
            `${config.invite_tracker.invite_top.command_aliases.alias_1}`,
            `${config.invite_tracker.invite_top.command_aliases.alias_2}`,
            `${config.invite_tracker.invite_top.command_aliases.alias_3}`,
            `${config.invite_tracker.invite_top.command_aliases.alias_4}`,
            `${config.invite_tracker.invite_top.command_aliases.alias_5}`
    ],
    usage: `${config.invite_tracker.invite_top.command_usage}`,
}