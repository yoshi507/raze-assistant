require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection, Events, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});

client.commands = new Collection();
client.modmailTickets = new Map(); // userId -> channelId
client.warnings = new Map(); // userId -> [{reason, moderator, timestamp}]

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

client.once(Events.ClientReady, async (c) => {
  console.log(`🔥 Raze Assistant is online as ${c.user.tag}`);
  c.user.setActivity('DM me for support | /help', { type: ActivityType.Watching });

  // Register slash commands for the guild
  const guild = c.guilds.cache.get(process.env.GUILD_ID);
  if (guild) {
    const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
    await guild.commands.set(commands);
    console.log(`✅ Registered ${commands.length} slash commands`);
  } else {
    console.warn('⚠️ GUILD_ID not found or bot not in guild – slash commands not registered');
  }
});

client.login(process.env.DISCORD_TOKEN);
