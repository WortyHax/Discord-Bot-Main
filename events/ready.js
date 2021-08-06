const logger = require('../logger');
const tickets = require("../storage/ticket.json")
const config = require('../storage/config.json')

module.exports.run = async (Client) => {
		console.log([
			`Logged in as ${Client.user.tag}`
		].join('\n'));

		const activities = [
			`${Client.emojis.cache.size} emojis!`,
			`${Client.channels.cache.size} channels!`,
			`${Client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`
		];

		let i = 0;
		setInterval(() => Client.user.setActivity(`${config.settings.prefix}help | ${activities[i++ % activities.length]}`, { type: 'LISTENING' }), 15000);

		if (tickets.message && tickets.channel) {
        	Client.channels.fetch(tickets.channel).then(ch => {
            	ch.messages.fetch(tickets.message).then(m => {
                logger.info("Cached ticket creator!");
			});
        })
    }
}

module.exports.info = {
    name: "ready"
}
