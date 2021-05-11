const discord = require("discord.js")
const config = require("../storage/config.json");
const logger = require("../logger")

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    if (!args[0]) {
        return msg.channel.send(
            new discord.MessageEmbed()
            .setColor(config.colors.negative)
            .setFooter(config.embed.footer)
            .setTitle("No title specified!")
        );
    }

    msg.delete();

    const changelog = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer)
    .setTitle(args.join(" "))
    .setTimestamp();

    const embed = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer)
    .setTitle("What is the description for this changelog?")
    msg.channel.send(embed).then(m => {
        m.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 3600000})
            .then(collected => {
                changelog.setDescription(collected.first().content);
                collected.first().delete();

                embed.setTitle("Please enter the image with this changelog message");
                embed.setDescription("If there is none, enter `.`");
                m.edit(embed);

                m.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 3600000})
                    .then(collected2 => {
                        if (collected2.first().content !== ".")
                            changelog.setImage(collected2.first().content)
                        
                        collected2.first().delete()

                        msg.guild.channels.cache.get(config.channels.changelog).send(changelog);

                        embed.setTitle("Changelog sent!");
                        embed.setDescription("The changelog was successfully sent!");
                        m.edit(embed);
                    })
                    .catch(err => {
                        logger.error(err);
                        embed.setTitle("Whoops an error occured!");
                        embed.setDescription("Please check the console for more information");
                        m.edit(embed);
                    })

            })
            .catch(err => {
                logger.error(err);
                embed.setTitle("Whoops an error occured!");
                embed.setDescription("Please check the console for more information");
                m.edit(embed);
            })
    })
}

module.exports.help = {
    name: "update",
    description: "Make a update message!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "updates",
        "changelog",
        "change",
        "changelog"
    ],
    usage: "update <title>",
}