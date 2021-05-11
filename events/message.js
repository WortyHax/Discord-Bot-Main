const logger = require('../logger');
const config = require('../storage/config.json')
const messageUtils = require('../util/messageUtils')

function runCommand(command, Client, msg, args) {}

module.exports.run = (Client, msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(config.prefix)) return;

    const messageArray = msg.content.split(/ /g);
    const args = messageArray.slice(1);
    const cmd = messageArray[0].slice(config.prefix.length);

    const cmdFile = Client.commands.get(cmd) || Client.commands.get(Client.aliases.get(cmd));
    if (!cmdFile) return;
    if (cmdFile.help.permissions && cmdFile.help.permissions.length > 0) {
        for (let i = 0; i <= cmdFile.help.permissions.length; i++) {
            if (!msg.member.hasPermission(cmdFile.help.permissions[i])) {
                return messageUtils.sendPermError(msg.channel)
            }
            return cmdFile.run(Client, msg, args);
        }
    } else return cmdFile.run(Client, msg, args);
}

module.exports.info = {
    name: "message"
}