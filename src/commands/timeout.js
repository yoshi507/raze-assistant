const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout (mute) a member')
    .addUserOption(option =>
      option.setName('user').setDescription('The user to timeout').setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Duration (e.g. 10m, 1h, 1d)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for the timeout').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }
    if (!member.moderatable) {
      return interaction.reply({ content: '❌ I cannot timeout this user.', ephemeral: true });
    }

    const ms = parseDuration(durationStr);
    if (!ms || ms < 1000 || ms > 28 * 24 * 60 * 60 * 1000) {
      return interaction.reply({ content: '❌ Invalid duration. Use e.g. `10m`, `1h`, `1d` (max 28 days).', ephemeral: true });
    }

    await member.timeout(ms, `${reason} | By ${interaction.user.tag}`);

    const embed = new EmbedBuilder()
      .setColor(0xEB459E)
      .setTitle('⏱️ Member Timed Out')
      .addFields(
        { name: 'User', value: `${user.tag}`, inline: true },
        { name: 'Duration', value: durationStr, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

function parseDuration(str) {
  const match = str.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) return null;
  const num = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return num * multipliers[unit];
}
