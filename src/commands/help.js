const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands and features'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🔥 Raze Assistant – Help')
      .setDescription('Your all-in-one moderation, modmail & AI assistant.')
      .addFields(
        {
          name: '📬 Modmail',
          value: 'Simply **DM the bot** to open a private support ticket with staff.\nStaff reply in the ticket channel → message goes to you.',
        },
        {
          name: '🛡️ Moderation',
          value: '`/ban` `/kick` `/timeout` `/warn` `/warnings` `/purge` `/close`',
        },
        {
          name: '🤖 AI',
          value: '`/ask <question>` – Ask the AI anything',
        },
        {
          name: 'ℹ️ Other',
          value: '`/help` – This message\n`/ping` – Check latency',
        }
      )
      .setFooter({ text: 'Raze Assistant' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
