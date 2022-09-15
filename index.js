const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

const client = new Client({ intents: [Intents.FLAGS.GUILDS]})
client.commands = new Collection();

// Importing cron jobs
const checkNodes = require('./modules/checkNodes.js');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {

    if (!fs.existsSync(`./nodes.json`)) {
        fs.writeFile('./nodes.json', '{}', function (err) {
            if (err) throw err;
            console.log('nodes.js file has been created.');
        });
    } else {
        console.log('nodes.js file found.');
    }

    setActivityStatus();
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

module.exports.postToChannel = function (channelId, msg) {

    try {

        const channel = client.channels.cache.find(channel => channel.id === channelId)
        channel.send(msg);

        return true;

    } catch (error) {

        console.log(error);
        return false;

    }

}

async function setActivityStatus() {

    const fluxPrice = await getFluxPrice();
    client.user.setActivity(`$${fluxPrice} FLUX`, { type: 'WATCHING' });

    setInterval(async () => {
        const fluxPrice = await getFluxPrice();
        client.user.setActivity(`$${fluxPrice} FLUX`, { type: 'WATCHING' });
    }, 600000);

}

async function getFluxPrice() {
    const response = await fetch(`https://explorer.runonflux.io/api/currency`);
    var fluxPrice = await response.json();

    if (response) {
        let currentPrice = fluxPrice['data']['rate'];
        currentPrice = Math.round(currentPrice * 100) / 100;
        return currentPrice;
    }
}

getFluxPrice();

client.login(token);