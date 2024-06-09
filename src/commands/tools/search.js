const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const { API_URL } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for a specific anime or manga.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The anime or manga you want to search for.')
                .setRequired(true)
                .setMaxLength(200)

        )
        .addIntegerOption(option =>
            option.setName('entries')
                .setDescription('Number of entries to display. Default is 1.')
                .setMinValue(1)
                .setMaxValue(10)
        )
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The status of the anime you want to search for.')
                .addChoices(
                    { name: 'Airing', value: 'airing' },
                    { name: 'Complete', value: 'complete' },
                    { name: 'Upcoming', value: 'upcoming' },
                )
        ),

        async execute(interaction, client) {
        const message = await interaction.reply({ content: 'Searching...', fetchReply: true });
        const parameters = {
            q: interaction.options.getString('query'),
            status: interaction.options.getString('status'),
            order_by: 'mal_id',
            limit: interaction.options.getInteger('entries') || 1,
        };

        const params = new URLSearchParams(Object.fromEntries(Object.entries(parameters).filter(([_, v]) => v != null)));
        const req = await fetch(`${API_URL}/anime?${params}`).then(res => res.json());
        await interaction.editReply(`I found ${req.pagination.items.total} results for "${interaction.options.getString('query')}".\nThe most relevant result is: ${req.data[0].titles[0].title}.\nYou can view more information about this anime [here](${req.data[0].url}).`);
    }
}