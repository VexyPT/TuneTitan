import { Command } from "@discord/base";
import {
  ApplicationCommandType,
  Colors,
  EmbedBuilder,
  GuildMember,
  VoiceState,
} from "discord.js";
import { pagination } from "@magicyan/discord-ui";

export default new Command({
  name: "queue",
  description: "[🎵 Música] Exibe a fila de musicas.",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,

  async run({ interaction, client }) {
    await interaction.deferReply({ ephemeral: false });

    const member = interaction.member as GuildMember;

    const player = client.vulkava?.players.get(interaction.guild?.id!);

    if (!player) {
      return interaction.editReply({
        embeds: [{
            description: "O servidor não possui nenhum player ativo.",
            color: Colors.Red,
          }],
      });
    }

    const { channel } = member.voice as VoiceState;

    if (!channel) return interaction.editReply("Você precisa entrar em um canal de voz.");

    if (channel.id !== player.voiceChannelId)
      return interaction.editReply("Não estamos no mesmo canal de voz.");

    if (!player.playing)
      return interaction.editReply({
        content: "Não está tocando nenhuma música no momento.",
      });

    const embed = new EmbedBuilder();
    const queue = player.queue;
    const song = player.current;
    queue.tracks
    const currentPlaying = `Tocando agora [${song?.title}](${song?.uri})`;

    if (queue.size === 0) {
      embed.setDescription(`${currentPlaying}\n\n- Song queue is empty!`);

      await interaction.editReply({ embeds: [embed] });
    } else {
      
    }
  },
});
