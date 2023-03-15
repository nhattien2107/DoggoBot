const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)											
			.setFooter({ text: 'Doggo snitched the avatar for you.', iconURL: 'https://images-ext-2.discordapp.net/external/bYpErY_l2mK4tkJqdqm5vTo9xHMmmj0_2zPE4MQKhtI/https/cdn.discordapp.com/avatars/377932884687978506/0e72a95c4351562164bac0bfa152e17f.webp?width=160&height=160' });
		if (user) {
			embed.setDescription(`${user.username}'s avatar:`);
			embed.setImage(`${user.displayAvatarURL()}`);
		}
		else {
			embed.setDescription(`Your avatar:`);
			embed.setImage(`${interaction.user.displayAvatarURL()}`);
		}
		interaction.reply({ embeds: [embed] });
	},
};