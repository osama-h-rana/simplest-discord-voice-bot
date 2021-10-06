const { Client, Intents } = require("discord.js");
const { prefix, token } = require("./config.json"); //create a config file with your secret bot token and chosen prefix
const {
	joinVoiceChannel
} = require('@discordjs/voice');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  if (message.content.startsWith(`${prefix}join`)) {
    join(message);
    return;
  } else {
    message.reply("You need to enter a valid command!");
  }
});

async function join(message) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.reply(
      "You need to be in a voice channel to run this command!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT")) {
    return message.reply(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  try {
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });
    return message.reply(
      `Connected to ${voiceChannel}`
    );
  } catch (err) {
    console.log(err);
    return message.reply(err.message);
  }
}

client.login(token);