const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");
const QRCode = require("qrcode");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Bot listo como ${client.user.tag}`);

  // Registrar comandos slash SOLO cuando el bot está listo
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

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  )
    .then(() => console.log("Comandos slash registrados con éxito!"))
    .catch(err => console.error("Error al registrar comandos:", err));
});

// detectar comando
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "broma") {
    const texto = interaction.options.getString("texto");

    try {
      const qr = await QRCode.toBuffer(texto);
      await interaction.reply({
        content: `😈 QR creado con el texto:\n${texto}`,
        files: [{
          attachment: qr,
          name: "qr.png"
        }]
      });
    } catch (err) {
      console.error("Error generando QR:", err);
      await interaction.reply({ content: "¡Error al crear el QR! Intenta con otro texto.", ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
