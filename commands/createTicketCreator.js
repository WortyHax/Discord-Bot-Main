const discord = require("discord.js");
const fs = require("fs");
const config = require("../storage/config.json");
const ticketConfig = require("../storage/ticket.json");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    msg.delete();
    const embed = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer)
    .setTitle("TropMC | Support Panel");
    let str = ``;

    ticketConfig.types.forEach(type => {
        str += `${type.emoji} ${type.name}\n${type.description}\n\n`;
    });

    embed.setDescription(str);

    msg.channel.send(embed).then(m => {
        ticketConfig.message = m.id;
        ticketConfig.channel = m.channel.id;

        ticketConfig.types.forEach(async type => {
            await m.react(type.emoji);
        })

        fs.writeFileSync(
            process.cwd() + "/storage/ticket.json",
            JSON.stringify(ticketConfig, null, "\t"));
        
    })
}

module.exports.help = {
    name: "createTicketCreator",
    description: "Create the ticket creator message!",
    permissions: [
        "MANAGE_GUILD"
    ],
    alias: [
        "ctc",
        "createMessage"
    ],
    usage: "createTicketCreator",
}