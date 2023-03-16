const { SlashCommandBuilder } = require("@discordjs/builders")
const {ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("shows 10 songs in the queue at your input page.")
        .addStringOption(option => 
            option
            .setName("page")
            .setDescription("Page's number. (Default by 1).")),


    execute: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)
        
        // check if there are songs in the queue
        if (!queue || !queue.node.isPlaying())
        {
            await interaction.reply("There are no songs in the queue");
            return;
        }

        let num = Number(interaction.options.getString("page"));
        
        if(!num) num = 1;

        let pageStart = 10 * (num - 1);
        let pageEnd = 0;
        if (queue.tracks.size + 1 <= 10 || queue.tracks.size + 1 - pageStart <= 10) {
            pageEnd = queue.tracks.size + 1;
        }
        else {
            pageEnd = pageStart + 10;
        }
        const currentSong = queue.currentTrack;

        const queueString = queue.tracks.toArray().slice(pageStart, pageEnd).map((song, i) => {
            return `${i + pageStart + 1} [\`${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")
 
        let embed = new EmbedBuilder()
            .setDescription(`**Currently Playing**\n` + 
            (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
            `\n\n**Queue**\n${queueString}`)
            .setThumbnail(`${currentSong.thumbnail}`)
            .setFooter({ text: `${pageStart}/${pageEnd} - ${queue.tracks.size + 1} track(s) in queue.`, iconURL: `${interaction.user.displayAvatarURL()}` })
            
        
        await interaction.reply({
                embeds: [embed]
            })
    }
}