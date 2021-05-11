const rr = require("discord-reaction-role");
const db = require("../db")

module.exports.init = (client) => {
    module.exports.rr = new rr(client, {
        storage: process.cwd() + "/storage/reactionRoles.json"
    })
}
