const discord = require("discord.js");
const _ = require("lodash");
const config = require("../storage/config.json");
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
                color: config.embed.color,
                footer: config.embed.footer,
                title: `Invites Leaderboard`,
                description: top
            }
        });
    })
}

module.exports.help = {
    name: "invitetop",
    description: "Invites leaderboard",
    permissions: [],
    alias: [],
    usage: "invitetop",
}