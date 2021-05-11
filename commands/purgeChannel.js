module.exports.run = async (client, msg, args) => {
    const channel = msg.channel;
        if(client.purge.has(channel)) {
            client.purge.delete(channel);
            msg.reply(`All messages in ${channel} will no longer be deleted.`);
        } else {
            client.purge.add(channel);
            msg.reply(`All messages in ${channel} will now be deleted.`);
            msg.delete(1000);
        }
    }

module.exports.help = {
    name: "purgeChannel",
    description: "Clear a channel.",
    permissions: [],
    alias: [
        "purgechannel",
        "clearchannel",
        "clearChannel"
    ],
    usage: "clearChannel",
}