const Discord = require("discord.js");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");
const emoji = require("../storage/emojis.json");

module.exports.run = async (Client, message) => {
    message.delete();

    const restarting = new Discord.MessageEmbed()
    .setTitle(`${lang.restart.success.success_title}`)
    .setColor(config.embed.colors.mainColor)
    .setDescription(`<@${message.author.id}> ${lang.restart.success.success_description}`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(`${lang.restart.success.success_footer}`, message.author.avatarURL({ dynamic: true }))
    .setTimestamp()

    await message.channel.send(restarting)
    process.exit();
}

module.exports.help = {
    name: `${config.restart.command_name}`,
    description: `${config.restart.command_description}`,
    permissions: [
        `${config.restart.command_permissions.permission_1}`,
        `${config.restart.command_permissions.permission_2}`,
        `${config.restart.command_permissions.permission_3}`,
        `${config.restart.command_permissions.permission_4}`,
        `${config.restart.command_permissions.permission_5}`
    ],
    alias: [
            `${config.restart.command_aliases.alias_1}`,
            `${config.restart.command_aliases.alias_2}`
    ],
    usage: `${config.restart.command_usage}`,
}