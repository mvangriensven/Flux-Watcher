const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untracknode')
        .setDescription('deletes a node from the bot')
    .addStringOption(option => option.setName('nodeaddress').setDescription('the address of the node').setRequired(true)),
    async execute(interaction) {

        try {
            const nodeaddress   = interaction.options.getString('nodeaddress').replace(/\s/g, '');

            if (nodeaddress.charAt(0) != 't')
                return interaction.reply({content: `Invalid Flux Address.`, ephemeral: true});

            fs.readFile('./nodes.json', 'utf8', function (err, data) {
                if (err)
                    return interaction.reply({content: `An error occured`, ephemeral: true});

                var json = JSON.parse(data);

                for (let i = 0; i < json.length; i++) {

                    if (json[i]['nodeaddress'] == nodeaddress) {
                        json.splice(i, 1);
                    }
                }

                fs.writeFile("./nodes.json", JSON.stringify(json), 'utf8', function(err, result) {
                    if (err)
                        return interaction.reply({content: `An error occured`, ephemeral: true});
                });
            });

            return interaction.reply({ content: "Your node has been removed and will no longer be tracked.", ephemeral: true });
        } catch (err) {
            return interaction.reply({ content: `Command Failed: ${err}`, ephemeral: true });
        }
    }
}