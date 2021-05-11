const discord = require('discord.js')
const messageUtils = require('../util/messageUtils');
const giveaways = require('../util/GiveawayManager');
const logger = require('../logger');
const config = require('../storage/config.json');
const ms = require('ms');

module.exports.run = (Client, msg, args) => {
    if (!args[0]) {
        return messageUtils.sendSyntaxError(msg.channel, this)
    }

    const g = giveaways.manager.giveaways.find(g => g.messageID === args[0])
    
    if (!g) {
        return messageUtils.sendError(msg.channel, this, "Invalid giveaway");
    }
    
    switch (args[1]) {
        case "winners":
            if (!parseInt(args[2])) {
                return messageUtils.sendError(msg.channel, this, "Invalid number of winners")
            }
            g.edit({
                newWinnerCount: parseInt(args[2])
            }).then(() => {
                const embed = new discord.MessageEmbed()
                .setColor(config.colors.positive)
                .setTitle("Edited successfully!")
                .setTimestamp();
                msg.channel.send(embed).then(m => m.delete({timeout: 5000}))
            }).catch(err =>{
                logger.error(`An error occured while rerolling a giveaway ${g.messageID}`)
                logger.error(err)
                messageUtils.sendError(msg.channel, this, err.message)
            })
            break;
        case "prize":
            if (!args[2]) {
                return messageUtils.sendError(msg.channel, this, "No prize specified")
            }
            g.edit({
                newPrize: args.slice(2).join(" ")
            }).then(() => {
                const embed = new discord.MessageEmbed()
                .setColor(config.colors.positive)
                .setTitle("Edited successfully!")
                .setTimestamp();
                msg.channel.send(embed).then(m => m.delete({timeout: 5000}))
            }).catch(err =>{
                logger.error(`An error occured while rerolling a giveaway ${g.messageID}`)
                logger.error(err)
                messageUtils.sendError(msg.channel, this, err.message)
            })
            break;
        case "addtime":
            if (!args[2]) {
                return messageUtils.sendError(msg.channel, this, "No time specified");
            }
            if (!ms(args[2])) {
                return messageUtils.sendError(msg.channel, this, "Invalid time specified");
            }
            g.edit({
                addTime: ms(args[2])
            }).then(() => {
                const embed = new discord.MessageEmbed()
                .setColor(config.colors.positive)
                .setTitle("Edited successfully!")
                .setTimestamp();
                msg.channel.send(embed).then(m => m.delete({timeout: 5000}))
            }).catch(err =>{
                logger.error(`An error occured while rerolling a giveaway ${g.messageID}`)
                logger.error(err)
                messageUtils.sendError(msg.channel, this, err.message)
            })
            break;
        default: {
            const embed = new discord.MessageEmbed()
            .setColor(config.embed.color)
            .setTitle("Invalid option")
            .setDescription("Valid options are: winners, prize and addtime");
            msg.channel.send(embed);
            break;
        }
    }
}

module.exports.help = {
    name: "gedit",
    description: "Edit a giveaway!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [],
    usage: "gedit [addtime|prize|winners]",
}