const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(option =>
      option.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for the warning').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if (!client.warnings.has(user.id)) {
      client.warnings.set(user.id, []);
    }

    const warning = {
      reason,
      moderator: interaction.user.tag,
      moderatorId: interaction.user.id,
      timestamp: Date.now(),
    };

    client.warnings.get(user.id).push(warning);

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('⚠️ Member Warned')
      .addFields(
        { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Total Warnings', value: `${client.warnings.get(user.id).length}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Try to DM the user
    try {
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle(`⚠️ You have been warned in ${interaction.guild.name}`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp(),
        ],
      });
    } catch {
      // User has DMs closed
    }
  },
};
