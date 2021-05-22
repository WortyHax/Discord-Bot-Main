const giveaways = require('discord-giveaways');
const config = require('../storage/config.json')
let giveawayManager;

module.exports.init = (Client) => {
    module.exports.manager = new giveaways.GiveawaysManager(Client, {
        storage: process.cwd() + '/storage/giveaways.json',
        default: {
            botsCanWin: false,
            embedColor: config.embed.colors.color,
            embedColorEnd: config.embed.colors.color,
            reaction: "🎉"
        }
    });
}
