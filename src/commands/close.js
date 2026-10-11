const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current modmail ticket')
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for closing').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction, client) {
    const channel = interaction.channel;

    if (!channel.name?.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ This command can only be used inside a modmail ticket channel.', ephemeral: true });
    }

    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Find the user
    let targetUserId = null;
    for (const [userId, channelId] of client.modmailTickets.entries()) {
      if (channelId === channel.id) {
        targetUserId = userId;
        break;
      }
    }

    if (!targetUserId && channel.topic) {
      const match = channel.topic.match(/\((\d{17,19})\)/);
      if (match) targetUserId = match[1];
    }

    // Notify the user
    if (targetUserId) {
      try {
        const user = await client.users.fetch(targetUserId);
        await user.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xED4245)
              .setTitle('📬 Ticket Closed')
              .setDescription(`Your support ticket has been closed by staff.\n**Reason:** ${reason}`)
              .setTimestamp(),
          ],
        });
      } catch {
        // DMs closed
      }
      client.modmailTickets.delete(targetUserId);
    }

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle('🔒 Ticket Closed')
      .setDescription(`Closed by ${interaction.user.tag}\n**Reason:** ${reason}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Delete channel after short delay
    setTimeout(async () => {
      try {
        await channel.delete(`Modmail closed by ${interaction.user.tag}: ${reason}`);
      } catch (err) {
        console.error('Failed to delete ticket channel:', err);
      }
    }, 3000);
  },
};
