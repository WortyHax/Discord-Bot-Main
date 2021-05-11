const discord = require("discord.js");
const config = require("../storage/config.json");
const sanction = require("../util/sanction");
const sanctionTypes = require("../structures/sanctionTypes");
const ms = require("ms");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    const usertoban = msg.mentions.users.first(); // bad guy variable
    const reason = args.slice(2).join(" ");

    if (!args[1] || ms(args[1])) {
        return msg.channel.send({
            embed: {
                color: config.embed.color,
                footer: config.embed.footer,
                title: "You have either not specified an expiry or that is not a expiry I can understand!",
            }
        });
    }

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
                reason: `${member} tempbanned ${usertoban} for ${reason}`,
            }).then(() => {
                sanction(
                    sanctionTypes.TEMPBAN,
                    msg.author,
                    usertoban,
                    msg.guild,
                    reason,
                    new Date(new Date().getTime() + ms(args[1])),
                );
                msg.channel.send(bansucceed);
                const embed = new discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor(`Tempban issued by ${msg.author.username} (${msg.author.id}) to ${member} (${member.id})`, msg.author.avatarURL)
                    .setDescription(`Reason: ${reason}`);
                logs.send(embed);
                usertoban.send({
                    "embed": {
                        "color": config.embed.color,
                        "author": {
                            "name": `You have been tempbanned from ${msg.guild.name}!`
                        },
                        "description": `Reason: ${reason}\nDuration: ${args[1]}`,
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
    name: "tempban",
    description: "Tempban a member!",
    permissions: [
        "BAN_MEMBERS"
    ],
    alias: [],
    usage: "tempban [@user] [duration] [reason]",
}