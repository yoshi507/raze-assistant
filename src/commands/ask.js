const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const OpenAI = require('openai');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask the AI anything')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Your question for the AI')
        .setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');

    if (!process.env.AI_API_KEY) {
      return interaction.reply({
        content: '❌ AI is not configured. Set `AI_API_KEY` in the `.env` file.',
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      const openai = new OpenAI({
        apiKey: process.env.AI_API_KEY,
        baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
      });

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Raze Assistant, a helpful, witty, and concise Discord bot assistant. Keep answers clear and under 1500 characters when possible.',
          },
          { role: 'user', content: question },
        ],
        max_tokens: 800,
      });

      const answer = completion.choices[0]?.message?.content || 'No response generated.';

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🤖 AI Response')
        .setDescription(answer.slice(0, 4000))
        .addFields({ name: 'Question', value: question.slice(0, 1024) })
        .setFooter({ text: `Model: ${process.env.AI_MODEL || 'gpt-4o-mini'}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('AI error:', error);
      await interaction.editReply({
        content: `❌ Failed to get AI response: ${error.message || 'Unknown error'}`,
      });
    }
  },
};
