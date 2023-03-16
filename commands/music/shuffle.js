const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the current list"),

	execute: async ({ client, interaction }) => {

        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // If there is no queue, return
		if (!queue)
        {
            await interaction.reply("There are no songs in the queue");
            return;
        }
        const currentSong = queue.currentTrack
        
        queue.tracks.shuffle();

        // Return an embed to the user saying the song has been skipped
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`The queue has been shuffled!. Current song is ${currentSong.title}.`)
                    .setThumbnail(`${currentSong.thumbnail}`)
            ]
        })
	},
}