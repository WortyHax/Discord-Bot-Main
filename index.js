"use strict";
require('dotenv').config();

const discord = require('discord.js');
const fs = require('fs');
const config = require(process.cwd() + '/storage/config.json');
const emojis = require(process.cwd() + '/storage/emojis.json');
const lang = require(process.cwd() + '/storage/lang.json');
const cron = require("cron").CronJob;
const pagination = require('discord.js-pagination');
const {Op} = require("sequelize")

const logger = require('./logger');
const db = require('./db');
const giveaways = require('./util/GiveawayManager');
const reactionrole = require("./util/reactionRoleManager");
const sanctionTypes = require('./structures/sanctionTypes');

const Client = new discord.Client({
    ws: {
        intents: discord.Intents.ALL
    }
});
Client.commands = new discord.Collection();
Client.aliases = new discord.Collection();

fs.readdir("./commands", {}, (err, files) => {
    if (err) logger.error(err);
    let jsfile = files.filter(f => f.split(".").pop())
    jsfile.forEach(f => {
        const cmd = require(`./commands/${f}`);
        Client.commands.set(cmd.help.name, cmd);
        cmd.help.alias.forEach(alias => {
            Client.aliases.set(alias, cmd.help.name)
        });
        logger.info(`Loaded command ${cmd.help.name}`)
    })
})

fs.readdir("./events", {}, (err, files) => {
    if (err) logger.error(err);
    let jsfile = files.filter(f => f.split(".").pop())
    jsfile.forEach(f => {
        const event = require(`./events/${f}`);
        Client.on(event.info.name, event.run.bind(null, Client))
        logger.info(`Loaded event ${f}`);
    });
});

Client.login(config.settings.token)
giveaways.init(Client);
reactionrole.init(Client);

const sanctionRevoker = new cron(
    '* * * * *',
    () => {
        db.models.Sanction.findAll({
            where: {
                expire: {
                    [Op.lt]: Math.floor(new Date().getTime() / 1000)
                },
                revoked: false,
                type: {
                    [Op.or]: [
                        sanctionTypes.TEMPBAN,
                        sanctionTypes.TEMPMUTE
                    ]
                }
            }
        }).then(sanctions => {
            sanctions.forEach(sanction => {
                Client.guilds.fetch(sanction.guild).then(g => {
                    if (sanction.type == sanctionTypes.TEMPMUTE) {
                        g.member(sanction.user).roles.remove(config.roles.muted)
                            .catch(logger.error.bind(logger.error));
                        sanction.update({
                            revoked: true
                        }).catch(logger.error.bind(logger.error));
                    } else if (sanction.type == sanctionTypes.TEMPBAN) {
                        g.fetchBans().then(bans => {
                            if (bans.find(ban => ban.user.id == sanction.user)) return; 
                            g.members.unban(sanction.user).catch(logger.error.bind(logger.error));
                        })
                    }
                })
            })
        }),
        null,
        true,
        "Europe/London"
    }
);

sanctionRevoker.start();
