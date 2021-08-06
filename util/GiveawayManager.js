const giveaways = require('discord-giveaways');
const config = require('../storage/config.json')
const emoji = require('../storage/emojis.json')
let giveawayManager;

module.exports.init = (Client) => {
    module.exports.manager = new giveaways.GiveawaysManager(Client, {
        storage: process.cwd() + '/storage/giveaways.json',
        updateCountdownEvery: 10000,
        hasGuildMembersIntent: true,
        default: {
            botsCanWin: false,
            exemptPermissions: ['ADMINISTRATOR'],
            embedColor: config.embed.colors.mainColor,
            embedColorEnd: config.embed.colors.negative,
            reaction: `${emoji.tada}`
        }
    });
}
