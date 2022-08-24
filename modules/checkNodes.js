const { MessageEmbed } = require('discord.js')
const fs = require('fs');
const cron = require('node-cron');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));
const index = require('../index.js');

module.exports = {
    initiateModule: async function() {
        cron.schedule("*/60 * * * * *", async function() {
            try {
        
                const response = await fetch('https://explorer.runonflux.io/api/status?q=getFluxNodes');
                var fluxData = await response.json();
                fluxData = fluxData.fluxNodes;
        
                var data = fs.readFile('./nodes.json', 'utf8', function (err, data) {
                    if (err)
                        return console.log(err);
        
                    if (data == null || data == "")
                        return 
                        
                    nodeData = JSON.parse(data)
        
                    if (nodeData && nodeData.length > 0) {
                
                        for (var i = 0; i < nodeData.length; i++) {
                
                            // If node address can be found in Flux API.
                            if ( fluxData.some(item => item.payment_address === nodeData[i]['nodeaddress']) ) {
                
                                if (!nodeData[i]['online']) {
        
                                    nodeData[i]['online'] = true;
                                    
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#1F8B4C')
                                        .setTitle('A Flux Node just came back online!')
                                        .setDescription(`A node at ${nodeData[i]['nodeaddress']} just came back online!`)
                                        .setTimestamp()
        
                                    index.postToChannel(nodeData[i]['channelid'], { embeds: [msgEmbed] } );
        
                                }
                
                            } else if (nodeData[i]['online']) {
                
                                nodeData[i]['online'] = false;
        
                                // writeToFile(JSON.stringify(nodeData));
        
                                const msgEmbed = new MessageEmbed()
                                    .setColor('#ed3b3b')
                                    .setTitle('A Flux Node just went offline!')
                                    .setDescription(`A node at ${nodeData[i]['nodeaddress']} just went offline!`)
                                    .setTimestamp();
                    
                                index.postToChannel(nodeData[i]['channelid'], { embeds: [msgEmbed] } );
                
                            }
                        }
                
                        fs.writeFile("./nodes.json", JSON.stringify(nodeData), 'utf8', function(err, result) {
                            if (err)
                                console.error(err);
                        });
                    }
                });
        
        
            } catch (error) {
                console.error(error);
            }
        });
    }
}

async function checkNodes() {

    
}

function writeToFile (data) {

    fs.writeFile("./nodes.json", data, 'utf8', function (err, result) {
        if (err)
            console.log(err);
    });
}