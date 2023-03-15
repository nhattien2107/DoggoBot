const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("shows 10 songs in the queue at your input page."),
        // .addSubcommand(subcommand =>
        //     subcommand
        //     .setName("page")
        //     .setDescription("input the page number.")
        //     .addNumberOption(option => option.setName("pageNum").setDescription("Page's number. (Default by 1)."))
        // )


    execute: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)
        
        // check if there are songs in the queue
        if (!queue || !queue.node.isPlaying())
        {
            await interaction.reply("There are no songs in the queue");
            return;
        }

        // const pageNum = interaction.options.getNumber("pageNum");
        let pageNum = 1;

        let pageStart = 10 * (pageNum - 1);
        let pageEnd = pageStart + 10;
        const currentSong = queue.currentTrack;

        // Get the first 10 songs in the queue
        // const queueString = queue.tracks.slice(pageStart, pageEnd).map((song, i) => {
        //     return `${i + pageStart + 1} [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        // }).join("\n")
        const queueString = queue.tracks.toArray().slice(pageStart, pageEnd).map((song, i) => {
            return `${i + 1} [\`${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")

        let embed = new EmbedBuilder()
            .setDescription(`**Currently Playing**\n` + 
            (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
            `\n\n**Queue**\n${queueString}`)
            .setThumbnail(`${currentSong.thumbnail}`)
            .setFooter(`${pageStart}/${pageEnd} - ${queue.tracks.size} track(s) in queue.`)
        
        // const row = new ActionRowBuilder()
		// 	.addComponents(
		// 		new ButtonBuilder()
		// 			.setCustomId('back')
		// 			.setStyle(ButtonStyle.Primary)
		// 			.setEmoji('◀'),
		// 		new ButtonBuilder()
		// 			.setCustomId('forward')
		// 			.setEmoji('▶')
		// 			.setStyle(ButtonStyle.Primary),				
		// 		new ButtonBuilder()
		// 			.setEmoji('🔗')
		// 			.setURL('http://youtube.com/c/ChaeNoran')
		// 			.setStyle(ButtonStyle.Link),
		// 	);

        // const queueMessage = await interaction.reply({
        //     embeds: [embed], 
        //     components: [row]
        // })

        // const collector = queueMessage.createMessageComponentCollector({ 
        //     componentType: ComponentType.Button, time: 15000 });

        //     collector.on('collect', i => {
        //         if (i.user.id === interaction.user.id) {
        //             i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
        //         } else {
        //             i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
        //         }
        //     });    
        await interaction.reply({
                embeds: [embed]
            })
    }
}