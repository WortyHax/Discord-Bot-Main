const Discord = require("discord.js");
const config = require("../storage/config.json")

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

const pollEmbed = client.channels.cache.find(channel => channel.id === config.polls.polls)

const successSingle = new Discord.MessageEmbed()
.setTitle("Poll Creator")
.setColor(config.embed.color)
.setFooter(config.embed.footer)
.setThumbnail(config.embed.thumbnail)
.setDescription(`${message.author} your poll was successful and was posted in <#836316911934373929>!`)

const successMultiple = new Discord.MessageEmbed()
.setTitle("Poll Creator")
.setColor(config.embed.color)
.setFooter(config.embed.footer)
.setThumbnail(config.embed.thumbnail)
.setDescription(`${message.author} your poll was successful and was posted in <#836316911934373929>!`)

const timer = new Discord.MessageEmbed()
    .setAuthor(`Poll Creator`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(config.embed.footer)
    .setColor(config.embed.color)
    .setDescription(`${message.author} please wait before sending another poll.`)

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
    .setAuthor(`New poll by ${message.author.tag}`, `${config.embed.thumbnail}`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(config.embed.footer)
    .setColor(config.embed.color)
    .setDescription(`
    \u3000
    **${question}**
    `)

        return pollEmbed
          .send(pollSingle)
          .then(async (pollMessage) => {
            await pollMessage.react(config.emojis.thumbsup);
            await pollMessage.react(config.emojis.thumbsdown).then(message.channel.send(successSingle));
          });
      } else { // multiple choice
const limit = new Discord.MessageEmbed()
    .setAuthor(`Poll Creator`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(config.embed.footer)
    .setColor(config.embed.color)
    .setDescription(`${message.author} Polls are limited to \`20\` options.`)

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
    .setAuthor(`New poll by ${message.author.tag}`, `${config.embed.thumbnail}`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(config.embed.footer)
    .setColor(config.embed.color)
    .setDescription(`
    \u3000
    **${question}**\n
    ${questionOptions.map((option, i) => `${options[i]} - ${option}`).join('\n')}
    `)

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
    .setAuthor(`Poll Creator`)
    .setThumbnail(config.embed.thumbnail)
    .setFooter(config.embed.footer)
    .setColor(config.embed.color)
    .setDescription(`${message.author} invalid poll format! Question and options should be wrapped in \`"double quotes."\``)

      return message
        .channel
        .send(invalidFormat);
    }
  }

module.exports.help = {
    name: "poll",
    description: "Create a poll!",
    permissions: [],
    alias: [
        "polls",
        "pollcreator"
    ],
    usage: "poll <\"Title\">",
}