const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user')
    .addUserOption(option =>
      option.setName('user').setDescription('The user to check').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const warnings = client.warnings.get(user.id) || [];

    if (warnings.length === 0) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle(`Warnings for ${user.tag}`)
            .setDescription('This user has no warnings.')
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle(`⚠️ Warnings for ${user.tag}`)
      .setDescription(`Total: **${warnings.length}**`)
      .setTimestamp();

    warnings.slice(-10).forEach((w, i) => {
      embed.addFields({
        name: `#${warnings.length - 10 + i + 1} • ${w.moderator}`,
        value: `${w.reason}\n<t:${Math.floor(w.timestamp / 1000)}:R>`,
      });
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
