const {REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const path = require('node:path');
const {
	Client,
	GatewayIntentBits,
	ActivityType,
	Collection
} = require('discord.js');
const {
	clientId,
	token
} = require('./config.json');
const { Player } = require("discord-player");

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers]
});

const commands = [];

// Set a new item in the Collection
// With the key as the command name and the value as the exported module
client.commands = new Collection();
fs.readdirSync('./commands/').forEach(dirs => {
	const commandsPath = path.join(__dirname, `commands/${dirs}`);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const commandName = file.split(".")[0]
		const command = require(`./commands/${dirs}/${file}`);
		client.commands.set(commandName, command);
		commands.push(command.data.toJSON());
	}
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
// Add the player on the client
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

client.on("ready", () => {
	const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({version: '9'}).setToken(token);
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(clientId, guildId), 
            {body: commands})
        .then(() => console.log('Successfully updated commands for guild ' + guildId))
        .catch(console.error);
    }
	client.user.setActivity('Tiếng chó sủa lâu phai', {
		type: ActivityType.Listening
	});
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command",ephemeral: true});
    }
});

client.login(token);