const discord = require("discord.js");
const config = require("../storage/config.json");
const sanction = require("../util/sanction");
const types = require("../structures/sanctionTypes");
const sanctionTypes = require("../structures/sanctionTypes");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    const usertoban = msg.mentions.users.first(); // bad guy variable
    const reason = args.join(" ").slice(22);

    const logs = Client.channels.cache.get(config.logging.channel)

    //embeds
    const bansucceed = new discord.MessageEmbed()
        .addField("✅ User Successfully Banned!", `${usertoban} has been banned successfully!`)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer);
    const banfail1 = new discord.MessageEmbed()
        .addField("❌ User Failed to ban!", `Possibly because I do not have enough permissions to ban them`)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer);
    const banfail2 = new discord.MessageEmbed()
        .addField("❌ User Failed to ban!", `The user was not found in this guild!`)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer);
    const banfail3 = new discord.MessageEmbed()
        .addField("❌ User Failed to ban!", `You didn't mention the user to ban!`)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer);

    if (usertoban) {
        const member = msg.guild.member(usertoban); // check if user is in guild
        if (!reason) return msg.channel.send("Please specify a reason")
        if (member) { // kick the user
            member.ban({
                reason: `${member} banned ${usertoban} for ${reason}`,
            }).then(() => {
                sanction(sanctionTypes.BAN, msg.author, usertoban, reason);
                msg.channel.send(bansucceed);
                const embed = new discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor(`Ban issued by ${msg.author.username} (${msg.author.id}) to ${member} (${member.id})`, msg.author.avatarURL)
                    .setDescription(`Reason: ${reason}`);
                logs.send(embed);
                usertoban.send({
                    "embed": {
                        "color": config.embed.color,
                        "author": {
                            "name": `You have been banned from ${msg.guild.name}!`
                        },
                        "description": `Reason: ${reason}`,
                    }
                });
            }).catch(err => { // unable to kick user
                msg.channel.send(banfail1)
                const embed = new discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor(`An error occured while ${msg.author.username} (${msg.author.id}) tried to ban ${member} (${member.id})`)
                    .addField('Raw error:', err)
                    .setFooter(config.embed.footer);
                msg.channel.send(embed);
                return console.log(err);
            });
        } else { // user not in guild
            msg.channel.send(banfail2);
        }
    } else { // user not mentioned
        msg.channel.send(banfail3);
    }
}

module.exports.help = {
    name: "ban",
    description: "Ban a member!",
    permissions: [
        "BAN_MEMBERS"
    ],
    alias: [],
    usage: "ban [@user] [reason]",
}