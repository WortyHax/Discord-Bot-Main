const Discord = require("discord.js");
const config = require("../storage/config.json")

module.exports.run = (Client, message, args) => {

    const Embed = new Discord.MessageEmbed();
    let roles = [];
    if (!message.mentions.users.first()) {
      message.member.roles.cache.forEach((role) => {
        roles.push(role.name);
      });
      Embed.setTitle(`Your avatar!`);
      Embed.setDescription(`[Avatar Link](${message.author.displayAvatarURL(({ dynamic : true }))})`);
      Embed.setImage(message.author.displayAvatarURL(({ dynamic : true })));
      Embed.setColor(config.embed.color);
      return message.channel.send(Embed);

    } else {
      let User = message.mentions.members.first();
      User.roles.cache.forEach((role) => {
        roles.push(role.name);
      });
      Embed.setTitle(`${Client.users.cache.get(User.id).tag}'s Avatar!`);
      Embed.setDescription(`[Avatar Link](${Client.users.cache.get(User.id).displayAvatarURL(({ dynamic : true }))})`);
      Embed.setImage(Client.users.cache.get(User.id).displayAvatarURL(({ dynamic : true })));
      Embed.setColor(config.embed.color);
      return message.channel.send(Embed);
    }
  },

module.exports.help = {
    name: "avatar",
    description: "Get avatar of mentioned member.",
    permissions: [],
    alias: [],
    usage: "avatar [user]",
}