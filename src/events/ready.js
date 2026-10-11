const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    // Already handled in index.js, this is a placeholder if needed
  },
};
