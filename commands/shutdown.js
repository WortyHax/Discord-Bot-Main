const Discord = require("discord.js");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");
const emojis = require("../storage/emojis.json");

module.exports.run = (Client, message) => {
    message.delete();

    const embed = new Discord.MessageEmbed()
        .setTitle(`${lang.shutdown.success.success_title}`)
        .setColor(config.embed.colors.mainColor)
        .setDescription(`${lang.shutdown.success.success_description} ${emojis.shutdown}`)
        .setThumbnail(config.embed.thumbnail)
        .setFooter(`${lang.shutdown.success.success_footer} ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()
        
        message.channel.send(embed).then(m => {
            console.log(`${lang.shutdown.console_log.separators}`)
            console.log(`
            \u3000\u3000\u3000${lang.shutdown.console_log.system_shutdown}

            ${lang.shutdown.console_log.issued_by} ${message.author.tag}
            `)
            console.log(`${lang.shutdown.console_log.separators}`)
            Client.destroy();
})};

module.exports.help = {
    name: `${config.shutdown.command_name}`,
    description: `${config.shutdown.command_description}`,
    permissions: [
        `${config.shutdown.command_permissions.permission_1}`,
        `${config.shutdown.command_permissions.permission_2}`,
        `${config.shutdown.command_permissions.permission_3}`,
        `${config.shutdown.command_permissions.permission_4}`,
        `${config.shutdown.command_permissions.permission_5}`
    ],
    alias: [
        `${config.shutdown.command_aliases.alias_1}`,
        `${config.shutdown.command_aliases.alias_2}`,
        `${config.shutdown.command_aliases.alias_3}`
    ],
    usage: `${config.shutdown.command_usage}`,
}