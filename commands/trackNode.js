const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tracknode')
        .setDescription('registers a node to the bot')
        .addStringOption(option => option.setName('nodeaddress').setDescription('the address of the node').setRequired(true)),
        async execute(interaction) {

            try {
                const nodeaddress   = interaction.options.getString('nodeaddress').replace(/\s/g, '');
                const channelid     = String(interaction.channel.id);
    
                if (nodeaddress.charAt(0) != 't')
                    return interaction.reply({content: `Invalid Flux Address.`, ephemeral: true});

                let newNodeData = {
                    channelid: channelid,
                    nodeaddress: nodeaddress,
                    online: true
                };

                fs.readFile('./nodes.json', 'utf8', function (err, data) {
                    if (err)
                        return interaction.reply({content: `An error occured`, ephemeral: true});

                    var json = JSON.parse(data)
                    json.push(newNodeData);

                    fs.writeFile("./nodes.json", JSON.stringify(json), 'utf8', function(err, result) {
                        if (err)
                            return interaction.reply({content: `An error occured`, ephemeral: true});
                    });
                });

                return interaction.reply({ content: "Your node has been registered and will be tracked.", ephemeral: true });
            } catch (error) {
                return interaction.reply({ content: `An error occurred: ${error}`, ephemeral: true });
            }

        }
}