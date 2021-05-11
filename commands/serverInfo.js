const Discord = require("discord.js");
const config = require("../storage/config.json");
const pagination = require('discord.js-pagination');
const moment = require('moment');

const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydeny: 'Sydeny',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South'
};

module.exports.run = (Client, message, args) => {

    const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
    const members = message.guild.members.cache;
    const channels = message.guild.channels.cache;
    const emojis = message.guild.emojis.cache;
    let rolemap = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join("\n");
            if (rolemap.length > 1024) rolemap = "To many roles to display";
            if (!rolemap) rolemap = "No roles";

    const embed = new Discord.MessageEmbed()
        .setAuthor(`Server Information`, message.guild.iconURL({ dynamic: true }))
        .setColor(config.embed.color)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`
        **General:**
        ➥ Guild Name: \`${message.guild.name}\`
        ➥ Guild ID: \`${message.guild.id}\`
        ➥ Guild Owner:
        \u3000\u3000Tag: \`${message.guild.owner.user.tag}\`
        \u3000\u3000ID: \`${message.guild.ownerID}\`
        ➥ Region: \`${regions[message.guild.region]}\`
        ➥ Boost Tier: \`${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}\`
        ➥ Explicit Filter: \`${filterLevels[message.guild.explicitContentFilter]}\`
        ➥ Verification Level: \`${verificationLevels[message.guild.verificationLevel]}\`
        ➥ Time Created: \`${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}\`\n
        **Statistics:**
        ➥ Role Count: \`${roles.length}\`
        ➥ Emoji:
        \u3000\u3000Total Emojis: \`${emojis.size}\`
        \u3000\u3000Regular Emoji Count: \`${emojis.filter(emoji => !emoji.animated).size}\`
        \u3000\u3000Animated Emoji Count: \`${emojis.filter(emoji => emoji.animated).size}\`
        ➥ Member Count: 
        \u3000\u3000Total Members: \`${message.guild.memberCount}\`
        \u3000\u3000Humans: \`${members.filter(member => !member.user.bot).size}\`
        \u3000\u3000Bots: \`${members.filter(member => member.user.bot).size}\`
        ➥ Channels:
        \u3000\u3000Text Channels: \`${channels.filter(channel => channel.type === 'text').size}\`
        \u3000\u3000Voice Channels: \`${channels.filter(channel => channel.type === 'voice').size}\`
        ➥ Boost Count: \`${message.guild.premiumSubscriptionCount || '0'}\`\n
        **Presence:**
        \u3000\u3000➥ Online: \`${members.filter(member => member.presence.status === 'online').size}\`
        \u3000\u3000➥ Idle: \`${members.filter(member => member.presence.status === 'idle').size}\`
        \u3000\u3000➥ Do Not Disturb: \`${members.filter(member => member.presence.status === 'dnd').size}\`
        \u3000\u3000➥ Offline: \`${members.filter(member => member.presence.status === 'offline').size}\``)
        .setTimestamp();
    const embed2 = new Discord.MessageEmbed()
    .setAuthor(`Role List [${roles.length - 1} roles]`, message.guild.iconURL({ dynamic: true }))
    .setColor(config.embed.color)
    .setDescription(`
    \u200b
    **Roles:**
    ${rolemap}`)
    .setTimestamp();

        const pages = [
            embed,
            embed2
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '600000';

        const deletee = true

        pagination(message, pages, emojiList, timeout, deletee)
};

module.exports.help = {
    name: "serverinfo",
    description: "Get some server information.",
    permissions: [],
    alias: [
        "serverinfo"
    ],
    usage: "serverInfo",
}