const Discord = require("discord.js");
const emoji = require("../storage/emojis.json")
const config = require("../storage/config.json")
const lang = require("../storage/lang.json")

module.exports.run = async (bot, message, args) => {
    message.delete();
    let Emojis = "";
    let EmojisAnimated = "";
    let EmojiCount = 0;
    let Animated = 0;
    let OverallEmojis = 0;

    function Emoji(id) {
        return bot.emojis.cache.get(id).toString()
    }    
    message.guild.emojis.cache.forEach(emoji => {
        OverallEmojis++;
        if(emoji.animated) {
            Animated++;
            EmojisAnimated+=Emoji(emoji.id)
        }else{
            EmojiCount++;
            Emojis+=Emoji(emoji.id)
        }
    })
    let Embed = new Discord.MessageEmbed()
    .setTitle(`${lang.emojis.list}`)
    .setThumbnail(config.embed.thumbnail)
    .setDescription(`${lang.emojis.animated_1}${Animated}${lang.emojis.animated_2}\n> ${EmojisAnimated}\n\n${lang.emojis.standard_1}${EmojiCount}${lang.emojis.standard_2}\n> ${Emojis}\n\n${lang.emojis.overall_1}${OverallEmojis}${lang.emojis.overall_2}`)
    .setColor(config.embed.colors.mainColor)
    .setFooter(`${lang.emojis.footer} ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
    .setTimestamp()
    message.channel.send(Embed)
}

module.exports.help = {
    name: `${config.emojis.command_name}`,
    description: `${config.emojis.command_description}`,
    permissions: [],
    alias: [
        `${config.emojis.command_aliases.alias_1}`,
        `${config.emojis.command_aliases.alias_2}`,
        `${config.emojis.command_aliases.alias_3}`,
        `${config.emojis.command_aliases.alias_4}`,
        `${config.emojis.command_aliases.alias_5}`
    ],
    usage: `${config.emojis.command_usage}`,
}