const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");
const QRCode = require("qrcode");

const TOKEN = "MTQ3MzEyNDA2ODM0NDQ2MzQ3Mg.GTIgBW.imi4TgFXCuagQOlSEOuMaFx9Ww2BHfzq0cyMq0";
const CLIENT_ID = "1473124068344463472";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log("Bot listo");
});

// detectar comando
client.on("interactionCreate", async interaction => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "broma") {

    const texto = interaction.options.getString("texto");

    const qr = await QRCode.toBuffer(texto);

    await interaction.reply({

      content: `😈 QR creado con el texto:\n${texto}`,

      files: [{
        attachment: qr,
        name: "qr.png"
      }]

    });

  }

});

client.login(TOKEN);


// crear comando
const commands = [

  new SlashCommandBuilder()
    .setName("broma")
    .setDescription("Crear QR personalizado")
    .addStringOption(option =>
      option
        .setName("texto")
        .setDescription("Texto o link del QR")
        .setRequired(true)
    )

].map(c => c.toJSON());


const rest = new REST({ version: "10" }).setToken(TOKEN);

rest.put(
  Routes.applicationCommands(CLIENT_ID),
  { body: commands }
);

