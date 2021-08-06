const Discord = require("discord.js");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");
const emoji = require("../storage/emojis.json");
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

module.exports.run = async (Client, message, args, bot) => {
    message.delete();

    const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
    const members = message.guild.members.cache;
    const channels = message.guild.channels.cache;
    const emojis = message.guild.emojis.cache;
    let rolemap = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join("\n");
            if (rolemap.length > 1024) rolemap = `${lang.serverInfo.roles.to_many_roles}`;
            if (!rolemap) rolemap = `${lang.serverInfo.roles.no_roles}`;

    const embed = new Discord.MessageEmbed()
        .setAuthor(`${lang.serverInfo.serverInfo_panel.author}`, message.guild.iconURL({ dynamic: true }))
        .setColor(config.embed.colors.mainColor)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`
        ${lang.serverInfo.serverInfo_panel.general.title}
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.general.name} \`${message.guild.name}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.general.id} \`${message.guild.id}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.general.owner_1}
        \u3000\u3000${lang.serverInfo.serverInfo_panel.general.owner_2} \`${message.guild.owner.user.tag}\`
        \u3000\u3000${lang.serverInfo.serverInfo_panel.general.owner_3} \`${message.guild.ownerID}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.general.region} \`${regions[message.guild.region]}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.general.boost_tier_1} \`${message.guild.premiumTier ? `${lang.serverInfo.serverInfo_panel.general.boost_tier_2} ${message.guild.premiumTier}` : `${lang.serverInfo.serverInfo_panel.general.boost_tier_3}`}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.general.explict_filter} \`${filterLevels[message.guild.explicitContentFilter]}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.general.verification_level} \`${verificationLevels[message.guild.verificationLevel]}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.general.time_created} \`${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}\`\n
        ${lang.serverInfo.serverInfo_panel.statistics.title}
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.statistics.role_count} \`${roles.length}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.statistics.emoji_1}
        \u3000\u3000${lang.serverInfo.serverInfo_panel.statistics.emoji_2} \`${emojis.size}\`
        \u3000\u3000${lang.serverInfo.serverInfo_panel.statistics.emoji_3} \`${emojis.filter(emoji => !emoji.animated).size}\`
        \u3000\u3000${lang.serverInfo.serverInfo_panel.statistics.emoji_4} \`${emojis.filter(emoji => emoji.animated).size}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.statistics.memberCount_1} 
        \u3000\u3000${lang.serverInfo.serverInfo_panel.statistics.memberCount_2} \`${message.guild.memberCount}\`
        \u3000\u3000${lang.serverInfo.serverInfo_panel.statistics.memberCount_3} \`${members.filter(member => !member.user.bot).size}\`
        \u3000\u3000${lang.serverInfo.serverInfo_panel.statistics.memberCount_4} \`${members.filter(member => member.user.bot).size}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.statistics.channels_1}
        \u3000\u3000${lang.serverInfo.serverInfo_panel.statistics.channels_2} \`${channels.filter(channel => channel.type === 'text').size}\`
        \u3000\u3000${lang.serverInfo.serverInfo_panel.statistics.channels_3} \`${channels.filter(channel => channel.type === 'voice').size}\`
        ${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.statistics.boost_count_1} \`${message.guild.premiumSubscriptionCount || `${lang.serverInfo.serverInfo_panel.statistics.boost_count_2}`}\`\n
        ${lang.serverInfo.serverInfo_panel.presence.title}
        \u3000\u3000${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.presence.presence_1} \`${members.filter(member => member.presence.status === 'online').size}\`
        \u3000\u3000${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.presence.presence_2} \`${members.filter(member => member.presence.status === 'idle').size}\`
        \u3000\u3000${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.presence.presence_3} \`${members.filter(member => member.presence.status === 'dnd').size}\`
        \u3000\u3000${lang.serverInfo.serverInfo_panel.separators} ${lang.serverInfo.serverInfo_panel.presence.presence_4} \`${members.filter(member => member.presence.status === 'offline').size}\``)
        .setTimestamp();
    const embed2 = new Discord.MessageEmbed()
    .setAuthor(`${lang.serverInfo.serverInfo_panel.roles.author_1} ${lang.serverInfo.serverInfo_panel.roles.author_2}${roles.length - 1} ${lang.serverInfo.serverInfo_panel.roles.author_3}`, message.guild.iconURL({ dynamic: true }))
    .setColor(config.embed.colors.mainColor)
    .setDescription(`
    ${lang.serverInfo.serverInfo_panel.roles.title}
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
    name: `${config.serverInfo.command_name}`,
    description: `${config.serverInfo.command_description}`,
    permissions: [],
    alias: [
        `${config.serverInfo.command_aliases.alias_1}`,
        `${config.serverInfo.command_aliases.alias_2}`,
        `${config.serverInfo.command_aliases.alias_3}`,
        `${config.serverInfo.command_aliases.alias_4}`,
        `${config.serverInfo.command_aliases.alias_5}`
    ],
    usage: `${config.serverInfo.command_usage}`,
}