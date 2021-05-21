const Discord = require("discord.js")
const ms = require("ms")
const db = require("quick.db")
const config = require("../storage/config.json")

module.exports.run = async(client,message,args)=> {
let timeuser = args[0]
let reason = args.slice(1).join(" ")
// !remind 10m Dream Code Uploaded video

if(!timeuser) return message.reply(":x: You should enter time 10m 10s 10d")
if(!reason) return message.reply(":x: You should enter reason")

const success = new Discord.MessageEmbed()
.setTitle("Reminder Successful!")
.setColor(config.embed.color)
.setThumbnail(message.author.avatarURL({ dynamic: true }))
.setDescription(`<@${message.author.id}> your reminder was successful! ${config.emojis.success}`)
.addFields(
    { name: `Time:`, value: `\`${timeuser}\``, inline: true },
    { name: `Reason:`, value: `\`${reason}\``, inline: true },
)
.setTimestamp()

db.set(`remind.${message.author.id}`,Date.now() + ms(timeuser))
message.channel.send(success)
const interval = setInterval(function() {


    if(Date.now() > db.fetch(`remind.${message.author.id}`)){
        db.delete(`remind.${message.author.id}`)
        message.author.send(`**Remind:**${reason}`)
        .catch(e => console.log(e))
        clearInterval(interval)
}})}

module.exports.help = {
    name: "remind",
    description: "Create a reminder.",
    permissions: [],
    alias: [
        "reminder"
    ],
    usage: "remind <time> <reminder_text>",
}