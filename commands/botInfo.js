const Discord = require("discord.js");
const { version } = require('../package.json');
const { utc } = require('moment');
const os = require('os');
const ms = require('ms');
const moment = require("moment");
const config = require("../storage/config.json");
const lang = require("../storage/lang.json");

module.exports.run = (Client, msg, args) => {
    msg.delete();

    // Format Uptime (DD:HH:MM:SS) //
    function format(seconds){
        function pad(s){
          return (s < 10 ? '0' : '') + s;
        }
        var days = Math.floor(seconds / (60*60*24));
        var hours = Math.floor(seconds / (60*60));
        var minutes = Math.floor(seconds % (60*60) / 60);
        var seconds = Math.floor(seconds % 60);
      
        return pad(days) + ':' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
      }

      var uptime = process.uptime();

    // Total Ram //
    var total_memory = os.totalmem();
    var total_mem_in_kb = total_memory/1024;
    var total_mem_in_mb = total_mem_in_kb/1024;
    var total_mem_in_gb = total_mem_in_mb/1024;
   
    total_mem_in_kb = Math.floor(total_mem_in_kb);
    total_mem_in_mb = Math.floor(total_mem_in_mb);
    total_mem_in_gb = Math.floor(total_mem_in_gb);
   
    total_mem_in_mb = total_mem_in_mb%1024;
    total_mem_in_kb = total_mem_in_kb%1024;
    total_memory = total_memory%1024;

    // Remaining Ram //
    var free_memory = os.freemem();
    var free_mem_in_kb = free_memory/1024;
    var free_mem_in_mb = free_mem_in_kb/1024;
    var free_mem_in_gb = free_mem_in_mb/1024;
   
    free_mem_in_kb = Math.floor(free_mem_in_kb);
    free_mem_in_mb = Math.floor(free_mem_in_mb);
    free_mem_in_gb = Math.floor(free_mem_in_gb);
   
    free_mem_in_mb = free_mem_in_mb%1024;
    free_mem_in_kb = free_mem_in_kb%1024;
    free_memory = free_memory%1024;

        const core = os.cpus()[0];
        const embed = new Discord.MessageEmbed()
            .setTitle(`${lang.botInfo.title}`)
			.setThumbnail(config.embed.thumbnail)
			.setColor(config.embed.colors.mainColor)
            .setDescription(`
            ${lang.botInfo.general.title}
            ${lang.botInfo.separators} ${lang.botInfo.general.bot_name} \`${Client.user.tag}\`
            ${lang.botInfo.separators} ${lang.botInfo.general.commands} \`${Client.commands.size}\`
            ${lang.botInfo.separators} ${lang.botInfo.general.memberCount} \`${Client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\`
            ${lang.botInfo.separators} ${lang.botInfo.general.channels} \`${Client.channels.cache.size.toLocaleString()}\`
            ${lang.botInfo.separators} ${lang.botInfo.general.server_creationDate} \`${moment(msg.guild.createdTimestamp).format('LT')} ${moment(msg.guild.createdTimestamp).format('LL')} ${moment(msg.guild.createdTimestamp).fromNow()}\`
            ${lang.botInfo.separators} ${lang.botInfo.general.bot_creationDate} \`${utc(Client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}\`
            ${lang.botInfo.separators} ${lang.botInfo.general.nodeJS} \`${process.version}\`
            ${lang.botInfo.separators} ${lang.botInfo.general.botVersion_1} \`${lang.botInfo.general.botVersion_2}${version}\`\n
            ${lang.botInfo.system.title}
            ${lang.botInfo.separators} ${lang.botInfo.system.platform} \`${process.platform}\`
            ${lang.botInfo.separators} ${lang.botInfo.system.uptime_1} \`${format(uptime)} ${lang.botInfo.system.uptime_2}\`
            ${lang.botInfo.separators} ${lang.botInfo.system.cpu_1}
            \u3000 ${lang.botInfo.system.cpu_2} \`${os.cpus().length}\`
            \u3000 ${lang.botInfo.system.cpu_3} \`${core.model}\`
            \u3000 ${lang.botInfo.system.cpu_4} \`${core.speed}${lang.botInfo.system.cpu_5}\`\n
            ${lang.botInfo.separators} ${lang.botInfo.system.ram}
            \u3000 ${lang.botInfo.system.totalMemory}
            \u3000 \u3000 ${lang.botInfo.system.gb}${lang.botInfo.system.colon} \`${total_mem_in_gb}${lang.botInfo.system.gb}\`
            \u3000 \u3000 ${lang.botInfo.system.mb}${lang.botInfo.system.colon} \`${total_mem_in_mb}${lang.botInfo.system.mb}\`
            \u3000 \u3000 ${lang.botInfo.system.kb}${lang.botInfo.system.colon} \`${total_mem_in_kb}${lang.botInfo.system.kb}\`\n
            \u3000 ${lang.botInfo.system.freeMemory}
            \u3000 \u3000 ${lang.botInfo.system.gb}${lang.botInfo.system.colon} \`${free_mem_in_gb}${lang.botInfo.system.gb}\`
            \u3000 \u3000 ${lang.botInfo.system.mb}${lang.botInfo.system.colon} \`${free_mem_in_mb}${lang.botInfo.system.mb}\`
            \u3000 \u3000 ${lang.botInfo.system.kb}${lang.botInfo.system.colon} \`${free_mem_in_kb}${lang.botInfo.system.kb}\``)
            .setFooter(config.embed.footer)
			.setTimestamp();
            msg.channel.send(embed)
};

module.exports.help = {
    name: `${config.botInfo.command_name}`,
    description: `${config.botInfo.command_description}`,
    permissions: [],
    alias: [
        `${config.botInfo.command_aliases.alias_1}`,
        `${config.botInfo.command_aliases.alias_2}`,
        `${config.botInfo.command_aliases.alias_3}`
    ],
    usage: `${config.botInfo.command_usage}`,
}