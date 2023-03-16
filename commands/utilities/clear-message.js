const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('./avatar');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear-message')
    .setDescription('Clear message (up to 100).')
    .addStringOption(option => option.setName('target').setDescription('Number of message will be deleted.')),

    async execute(interaction) {
        if(!interaction.member.roles.cache.has('892776366741807154'))
            return interaction.reply("You are not my master. Don't order me to do dis.");

        const num = Number(interaction.options.getString('target'));     
        if(num > 100) 
            return interaction.reply("I can't eat more than 100 messages at one time.");
        else 
        {
            interaction.channel.messages.fetch({limit: num})
            .then((messages) => {
                const channelMessages = [];
                messages.forEach(msg => channelMessages.push(msg));
                for(let i = 0; i < channelMessages.length; i++) {
                    if((Date.now() - channelMessages[i].createdTimestamp) >= 1209600000) //14 days
                    {
                        channelMessages.splice(i);
                        break;
                    }else {
                        continue;
                    }
                }
                if(channelMessages.length === 0) {
                    interaction.reply("Cannot delete messages that are more than 2 weeks old.")
                }else {
                    interaction.channel.bulkDelete(channelMessages).then(() => {
                        interaction.reply(`I cleared **${channelMessages.length}** messages. Please praise me!`)
                    })
                }
            })
        }
    }    
}