const Discord = require("discord.js");
const { version } = require('../package.json');
const { utc } = require('moment');
const os = require('os');
const ms = require('ms');
const moment = require("moment");
const config = require("../storage/config.json");

module.exports.run = (Client, msg, args) => {

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
            .setTitle('System Information')
			.setThumbnail(config.embed.thumbnail)
			.setColor(config.embed.color)
            .setDescription(`
            **General:**
            ➥ Bot Name: \`${Client.user.tag}\`
            ➥ Commands: \`${Client.commands.size}\`
            ➥ Member Count: \`${Client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\`
            ➥ Channels: \`${Client.channels.cache.size.toLocaleString()}\`
            ➥ Server Creation Date: \`${moment(msg.guild.createdTimestamp).format('LT')} ${moment(msg.guild.createdTimestamp).format('LL')} ${moment(msg.guild.createdTimestamp).fromNow()}\`
            ➥ Creation Date: \`${utc(Client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}\`
            ➥ NodeJS Version: \`${process.version}\`
            ➥ Version: \`v${version}\`\n
            **System:**
            ➥ Platform: \`${process.platform}\`
            ➥ Uptime: \`${format(uptime)} DD:HH:MM:SS\`
            ➥ CPU:
            \u3000 Cores: \`${os.cpus().length}\`
            \u3000 Model: \`${core.model}\`
            \u3000 Speed: \`${core.speed}MHz\`\n
            ➥ RAM:
            \u3000 Total Memory:
            \u3000 \u3000 GB: \`${total_mem_in_gb}GB\`
            \u3000 \u3000 MB: \`${total_mem_in_mb}MB\`
            \u3000 \u3000 KB: \`${total_mem_in_kb}KB\`\n
            \u3000 Free Memory:
            \u3000 \u3000 GB: \`${free_mem_in_gb}GB\`
            \u3000 \u3000 MB: \`${free_mem_in_mb}MB\`
            \u3000 \u3000 KB: \`${free_mem_in_kb}KB\``)
            .setFooter(config.embed.footer)
			.setTimestamp();
            msg.channel.send(embed)
};

module.exports.help = {
    name: "botInfo",
    description: "Get some bot information.",
    permissions: [],
    alias: [
        "botinfo"
    ],
    usage: "botInfo",
}