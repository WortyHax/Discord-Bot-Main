const discord = require("discord.js");
const config = require("../storage/config.json");

/**
 * Log an action
 * @param {discord.Guild} guild The server to use to get the log channel in 
 * @param {string} title The title for the log message
 */
module.exports = (guild, title, description) => {
    const logembed = new discord.MessageEmbed({...config.embed})
    .setTitle(`${title}`)
    .setTimestamp()
    .setDescription(`${description}`);

    const channel = guild.channels.cache.get(config.logs.logs.moderation);
    channel.send(logembed);
}