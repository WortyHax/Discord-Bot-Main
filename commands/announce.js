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

    const announcement = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer)
    .setTitle(args.join(" "))
    .setTimestamp();

    const embed = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer)
    .setTitle("What is the description for this announcement?")
    msg.channel.send(embed).then(m => {
        m.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 3600000})
            .then(collected => {
                announcement.setDescription(collected.first().content);
                collected.first().delete();

                embed.setTitle("Please enter the image with this announcement");
                embed.setDescription("If there is none, enter `.`");
                m.edit(embed);

                m.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 3600000})
                    .then(collected2 => {
                        if (collected2.first().content !== ".")
                            announcement.setImage(collected2.first().content)
                        
                        collected2.first().delete()

                        msg.guild.channels.cache.get(config.channels.announcements).send(announcement);

                        embed.setTitle("Announcement sent!");
                        embed.setDescription("The announcement was successfully sent!");
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
    name: "announce",
    description: "Make an announcement!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [],
    usage: "announce [title]",
}