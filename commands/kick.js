const discord = require('discord.js');
const config = require("../storage/config.json");

module.exports.run = (Client, msg, args) => {
    const usertokick = msg.mentions.users.first(); // bad guy variable
    const reason = args.join(" ").slice(22);

    const logs = Client.channels.cache.get(config.channels.log)

    //embeds
    const kicksucceed = new discord.MessageEmbed()
        .addField("✅ User Successfully Kicked!", `${usertokick} has been kicked successfully!`)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer);
    const kickfail1 = new discord.MessageEmbed()
        .addField("❌ User Failed to kick!", `Possibly because I do not have enough permissions to kick them`)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer);
    const kickfail2 = new discord.MessageEmbed()
        .addField("❌ User Failed to kick!", `The user was not found in this guild!`)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer);
    const kickfail3 = new discord.MessageEmbed()
        .addField("❌ User Failed to kick!", `You didn't mention the user to kick!`)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer);

    if (usertokick) {
        const member = msg.guild.member(usertokick); // check if user is in guild
        if (!reason) return msg.channel.send("Please specify a reason")
        if (member) { // kick the user
            member.kick(`${member} kicked ${usertokick} for ${reason}`).then(() => {
                msg.channel.send(kicksucceed);
                const embed = new discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor(`Kick issued by ${msg.author.username} (${msg.author.id}) to ${member} (${member.id})`, msg.author.avatarURL())
                    .setDescription(`Reason: ${reason}`);
                logs.send(embed);
                usertokick.send({
                    "embed": {
                        "color": config.color,
                        "author": {
                            "name": `You have been Kicked from ${msg.guild.name}!`
                        },
                        "description": `Reason: ${reason}`,
                    }
                });
            }).catch(err => { // unable to kick user
                msg.channel.send(kickfail1)
                const embed = new discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor(`An error occured while ${msg.author.username} (${msg.author.id}) tried to kick ${member} (${member.id})`)
                    .addField('Raw error:', err)
                    .setFooter(config.embed.footer);
                msg.channel.send(embed)
                return console.log(err);
            });
        } else { // user not in guild
            msg.channel.send(kickfail2);
        }
    } else { // user not mentioned
        msg.channel.send(kickfail3);
    }
}

module.exports.help = {
    name: "kick",
    description: "Kick someone from the server!",
    permissions: [
        "KICK_MEMBERS"
    ],
    alias: [],
    usage: "kick [@user] [reason]",
}