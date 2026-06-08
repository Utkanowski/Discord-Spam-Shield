const {
    Client,
    GatewayIntentBits,
    PermissionsBitField,
    ChannelType,
    SlashCommandBuilder,
    REST,
    Routes
} = require('discord.js');

const fs = require('fs');

const TOKEN = 'BOT_TOKEN';
const CLIENT_ID = 'CLIENT_ID';
const GUILD_ID = 'GUILD_ID';

if (!fs.existsSync('./channels.json')) {
    fs.writeFileSync('./channels.json', '[]');
}

const savedChannels = JSON.parse(
    fs.readFileSync('./channels.json', 'utf8')
);

const protectedChannels = new Set(savedChannels);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', async () => {
    console.log(`${client.user.tag} is online`);

    const commands = [
        new SlashCommandBuilder()
            .setName('startup')
            .setDescription('Creates the anti-spambot system')
            .toJSON()
    ];

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
    );

    console.log('Slash commands registered');
    console.log(`Loaded ${protectedChannels.size} protected channels`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'startup') {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: 'You must be an administrator to use this command.',
                ephemeral: true
            });
        }

        const existingChannel = interaction.guild.channels.cache.find(
            c => protectedChannels.has(c.id)
        );

        if (existingChannel) {
            return interaction.reply({
                content: `Anti-spambot system already exists: ${existingChannel}`,
                ephemeral: true
            });
        }

        const channel = await interaction.guild.channels.create({
            name: 'anti-spambot',
            type: ChannelType.GuildText
        });

        protectedChannels.add(channel.id);

        fs.writeFileSync(
            './channels.json',
            JSON.stringify([...protectedChannels], null, 2)
        );

        await channel.send(
`# DO NOT SEND ANY MESSAGES HERE

Sending a message will **BAN** you

This is for automatically blocking spambots`
        );

        await interaction.reply({
            content: `Successfully created ${channel}`,
            ephemeral: true
        });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!protectedChannels.has(message.channel.id)) return;

    try {

        await message.guild.members.ban(message.author.id, {
            deleteMessageSeconds: 3600,
            reason: 'Triggered anti-spambot protection'
        });

        console.log(`${message.author.tag} was banned`);

    } catch (err) {
        console.error(err);
    }
});

client.login(TOKEN);