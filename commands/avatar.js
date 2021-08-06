const Discord = require("discord.js");
const config = require("../storage/config.json")
const lang = require("../storage/lang.json")

module.exports.run = (Client, message, args) => {
    message.delete();
    const Embed = new Discord.MessageEmbed();
    let roles = [];
    if (!message.mentions.users.first()) {
      message.member.roles.cache.forEach((role) => {
        roles.push(role.name);
      });
      Embed.setTitle(`${lang.avatar.avatar_self.self_title}`);
      Embed.setDescription(`[${lang.avatar.avatar_self.self_description}](${message.author.displayAvatarURL(({ dynamic : true }))})`);
      Embed.setImage(message.author.displayAvatarURL(({ dynamic : true })));
      Embed.setColor(config.embed.colors.mainColor);
      return message.channel.send(Embed);

    } else {
      let User = message.mentions.members.first();
      User.roles.cache.forEach((role) => {
        roles.push(role.name);
      });
      Embed.setTitle(`${Client.users.cache.get(User.id).tag}${lang.avatar.avatar_other.other_title}`);
      Embed.setDescription(`[${lang.avatar.avatar_other.other_description}](${Client.users.cache.get(User.id).displayAvatarURL(({ dynamic : true }))})`);
      Embed.setImage(Client.users.cache.get(User.id).displayAvatarURL(({ dynamic : true })));
      Embed.setColor(config.embed.colors.mainColor);
      return message.channel.send(Embed);
    }
  },

module.exports.help = {
    name: `${config.avatar.settings.command_name}`,
    description: `${config.avatar.settings.command_description}`,
    permissions: [],
    alias: [
        `${config.avatar.settings.command_aliases.alias_1}`
    ],
    usage: `${config.avatar.settings.command_usage}`,
}