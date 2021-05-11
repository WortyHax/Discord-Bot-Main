const discord = require('discord.js');
const config = require('../storage/config.json');

function sendPermError(channel) {
    const embed = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer)
    .setTitle("Insufficient permissions!")
    .setDescription("It appears you don't have enough permissions to do that!");
    channel.send(embed).then(m => m.delete({timeout: 5000}));
}

function sendSyntaxError(channel, command) {
    const embed = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(`Usage: ${command.help.usage}`)
    .setTitle("Incorrect usage!")
    .setDescription("It appears didn't use the command properly!");
    channel.send(embed).then(m => m.delete({timeout: 5000}));
}

function sendError(channel, command, error) {
    const embed = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setTitle(error)
    .setDescription("Make sure you have used the command properly and satisfied it's arguements.")
    .setFooter(command.help.usage);
    channel.send(embed).then(m => m.delete({timeout: 5000}));
}

function sendDM(user, message) {
    return new Promise((resolve, reject) => {
        if (user.dmChannel) {
            user.dmChannel.send(message).then(resolve).catch(reject)
        } else {
            user.createDM().then(ch => ch.send(message).then(resolve).catch(reject));
        }
    })
}

module.exports = {
    sendPermError,
    sendSyntaxError,
    sendError,
    sendDM
}
