const Discord = require("discord.js");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");
const emoji = require("../storage/emojis.json");

const poll = require("./poll");

const options = [
    '🇦',
    '🇧',
    '🇨',
    '🇩',
    '🇪',
    '🇫',
    '🇬',
    '🇭',
    '🇮',
    '🇯',
    '🇰',
    '🇱',
    '🇲',
    '🇳',
    '🇴',
    '🇵',
    '🇶',
    '🇷',
    '🇸',
    '🇹',
    '🇺',
    '🇻',
    '🇼',
    '🇽',
    '🇾',
    '🇿',
  ];

  const pollLog = {};
  
  function canSendPoll(user_id) {
    if (pollLog[user_id]) {
      const timeSince = Date.now() - pollLog[user_id].lastPoll;
      if (timeSince < 30000) {
        return false;
      }
    }
    return true;
  }

module.exports.run = (client, message) => {
  message.delete();

const pollEmbed = client.channels.cache.find(channel => channel.id === config.channels.polls)

const successSingle = new Discord.MessageEmbed()
.setTitle(`${lang.poll.success.single.title}`)
.setColor(config.embed.colors.mainColor)
.setFooter(config.embed.footer)
.setThumbnail(config.embed.thumbnail)
.setDescription(`${message.author} ${lang.poll.success.single.description_1} <#${config.channels.polls}>${lang.poll.success.single.description_2}`)

const successMultiple = new Discord.MessageEmbed()
.setTitle(`${lang.poll.success.multiple.title}`)
.setColor(config.embed.colors.mainColor)
.setFooter(config.embed.footer)
.setThumbnail(config.embed.thumbnail)
.setDescription(`${message.author} ${lang.poll.success.multiple.description_1} <#${config.channels.polls}>${lang.poll.success.multiple.description_2}`)

const timer = new Discord.MessageEmbed()
    .setTitle(`${lang.poll.error.timer.title}`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(config.embed.footer)
    .setColor(config.embed.colors.mainColor)
    .setDescription(`${message.author} ${lang.poll.error.timer.description}`)

let args = message.content.match(/"(.+?)"/g);
    if (args) {
      if (!canSendPoll(message.author.id)) {
        return message
          .channel
          .send(timer);
      } else if (args.length === 1) { // yes no unsure question
        const question = args[0].replace(/"/g, '');
        pollLog[message.author.id] = {
          lastPoll: Date.now()
        };
const pollSingle = new Discord.MessageEmbed()
    .setAuthor(`${lang.poll.poll.single.title}`, `${config.embed.thumbnail}`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(`${lang.poll.poll.single.footer_1} ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
    .setColor(config.embed.colors.mainColor)
    .setDescription(`
    \u3000
    **${question}**
    `)

        return pollEmbed
          .send(pollSingle)
          .then(async (pollMessage) => {
            await pollMessage.react(emoji.thumbsup);
            await pollMessage.react(emoji.thumbsdown).then(message.channel.send(successSingle));
          });
      } else { // multiple choice
const limit = new Discord.MessageEmbed()
    .setTitle(`${lang.poll.error.limit.title}`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(config.embed.footer)
    .setColor(config.embed.colors.mainColor)
    .setDescription(`${message.author} ${lang.poll.error.limit.description_1} \`${lang.poll.error.limit.description_2}\` ${lang.poll.error.limit.description_3}`)

        args = args.map(a => a.replace(/"/g, ''));
        const question = args[0];
        const questionOptions = [...new Set(args.slice(1))];
        if (questionOptions.length > 20) {
          return message.channel.send(limit);
        } else {
          pollLog[message.author.id] = {
            lastPoll: Date.now()
          };
const poll = new Discord.MessageEmbed()
    .setAuthor(`${lang.poll.poll.multiple.title}`, `${config.embed.thumbnail}`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(`${lang.poll.poll.multiple.footer_1} ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
    .setColor(config.embed.colors.mainColor)
    .setDescription(`
    \u3000
    **${question}**\n
    ${questionOptions.map((option, i) => `${options[i]} - ${option}`).join('\n')}\n
    _(( ${lang.poll.poll.multiple.description} ))_`)

          return pollEmbed
            .send(poll)
            .then(message.channel.send(successMultiple))
            .then(async (pollMessage) => {
              for (let i = 0; i < questionOptions.length; i++) {
                await pollMessage.react(options[i]);
              }
            });
        }
      }
    } else {
const invalidFormat = new Discord.MessageEmbed()
    .setTitle(`${lang.poll.error.invalidFormat.title}`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(config.embed.footer)
    .setColor(config.embed.colors.mainColor)
    .setDescription(`${message.author} ${lang.poll.error.invalidFormat.description_1} \`"${lang.poll.error.invalidFormat.description_2}"\`\n**${lang.poll.error.invalidFormat.description_3}** ${config.settings.prefix}${poll.help.name} "Title" "Option 1" "Option 2"`)

      return message
        .channel
        .send(invalidFormat);
    }
  }

module.exports.help = {
    name: `${config.poll.command_name}`,
    description: `${config.poll.command_description}`,
    permissions: [],
    alias: [
        `${config.poll.command_aliases.alias_1}`,
        `${config.poll.command_aliases.alias_2}`,
        `${config.poll.command_aliases.alias_3}`,
        `${config.poll.command_aliases.alias_4}`
    ],
    usage: `${config.poll.command_usage}`,
}