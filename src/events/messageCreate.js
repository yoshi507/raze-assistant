const { Events, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    // Ignore bots
    if (message.author.bot) return;

    // ===== MODMAIL: User DMs the bot =====
    if (message.channel.type === ChannelType.DM) {
      await handleModmailDM(message, client);
      return;
    }

    // ===== MODMAIL: Staff replies in ticket channel =====
    if (message.guild && message.channel.name?.startsWith('ticket-')) {
      await handleTicketReply(message, client);
      return;
    }
  },
};

async function handleModmailDM(message, client) {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    return message.reply('⚠️ Bot is not configured properly. Please contact the server owner.');
  }

  const categoryId = process.env.MODMAIL_CATEGORY_ID;
  const staffRoleId = process.env.STAFF_ROLE_ID;

  // Check if user already has an open ticket
  let ticketChannel = null;
  const existingChannelId = client.modmailTickets.get(message.author.id);

  if (existingChannelId) {
    ticketChannel = guild.channels.cache.get(existingChannelId);
  }

  if (!ticketChannel) {
    // Create new ticket channel
    try {
      ticketChannel = await guild.channels.create({
        name: `ticket-${message.author.username}`.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 90),
        type: ChannelType.GuildText,
        parent: categoryId || null,
        topic: `Modmail ticket for ${message.author.tag} (${message.author.id})`,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: staffRoleId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.AttachFiles,
              PermissionFlagsBits.EmbedLinks,
            ],
          },
          {
            id: client.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ManageChannels,
            ],
          },
        ],
      });

      client.modmailTickets.set(message.author.id, ticketChannel.id);

      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('📬 New Modmail Ticket')
        .setDescription(`Ticket opened by **${message.author.tag}**`)
        .addFields(
          { name: 'User ID', value: message.author.id, inline: true },
          { name: 'Account Created', value: `<t:${Math.floor(message.author.createdTimestamp / 1000)}:R>`, inline: true }
        )
        .setThumbnail(message.author.displayAvatarURL())
        .setFooter({ text: 'Reply in this channel to message the user • /close to close' })
        .setTimestamp();

      await ticketChannel.send({ content: staffRoleId ? `<@&${staffRoleId}>` : null, embeds: [welcomeEmbed] });

      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle('✅ Ticket Created')
            .setDescription('Your message has been sent to the staff team. They will reply here soon.')
            .setTimestamp(),
        ],
      });
    } catch (err) {
      console.error('Failed to create modmail ticket:', err);
      return message.reply('❌ Failed to create a ticket. Please try again later or contact staff directly.');
    }
  }

  // Relay the user's message to the ticket channel
  const userEmbed = new EmbedBuilder()
    .setColor(0x57F287)
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setDescription(message.content || '*No text content*')
    .setTimestamp();

  if (message.attachments.size > 0) {
    userEmbed.addFields({ name: 'Attachments', value: message.attachments.map(a => a.url).join('\n') });
  }

  await ticketChannel.send({ embeds: [userEmbed] });
}

async function handleTicketReply(message, client) {
  // Find the user this ticket belongs to
  let targetUserId = null;
  for (const [userId, channelId] of client.modmailTickets.entries()) {
    if (channelId === message.channel.id) {
      targetUserId = userId;
      break;
    }
  }

  // Fallback: try to parse from channel topic
  if (!targetUserId && message.channel.topic) {
    const match = message.channel.topic.match(/\((\d{17,19})\)/);
    if (match) targetUserId = match[1];
  }

  if (!targetUserId) return;

  try {
    const user = await client.users.fetch(targetUserId);
    const staffEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({ name: `Staff • ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setDescription(message.content || '*No text content*')
      .setFooter({ text: 'Reply to this DM to continue the conversation' })
      .setTimestamp();

    if (message.attachments.size > 0) {
      staffEmbed.addFields({ name: 'Attachments', value: message.attachments.map(a => a.url).join('\n') });
    }

    await user.send({ embeds: [staffEmbed] });
  } catch (err) {
    console.error('Failed to relay ticket reply:', err);
    await message.reply({ content: '⚠️ Could not deliver message to user (they may have DMs closed).', ephemeral: true }).catch(() => {});
  }
}
