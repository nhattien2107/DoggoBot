const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setStyle(ButtonStyle.Danger)
					.setEmoji('⏮️'),
				new ButtonBuilder()
					.setCustomId('secondary')
					.setEmoji('⏯️')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('success')
					.setEmoji('🔁')
					.setStyle(ButtonStyle.Primary),	
				new ButtonBuilder()
					.setCustomId('danger')
					.setEmoji('⏭️')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setEmoji('🔗')
					.setURL('http://youtube.com/c/ChaeNoran')
					.setStyle(ButtonStyle.Link),
			);
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');

		await interaction.reply({embeds: [embed], components: [row] });
	},
};