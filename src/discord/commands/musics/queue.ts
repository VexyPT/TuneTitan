import { Command } from "@discord/base";
import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  Colors,
  EmbedBuilder,
  GuildMember,
  VoiceState,
  formatEmoji,
} from "discord.js";
import { pagination } from "@magicyan/discord-ui";
import { hexToRgb } from "@/functions";
import { DefaultQueue } from "vulkava";
import { settings } from "@/settings";

export default new Command({
  name: "queue",
  description: "[🎵 Música] Exibe a fila de músicas.",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,

  async run({ interaction, client }) {
    await interaction.deferReply({ ephemeral: false });

    const member = interaction.member as GuildMember;

    const player = client.vulkava?.players.get(interaction.guild?.id!);

    if (!player) {
      return interaction.editReply({
        embeds: [
          {
            description: "O servidor não possui nenhum player ativo.",
            color: Colors.Red,
          },
        ],
      });
    }

    const { channel } = member.voice as VoiceState;

    if (!channel) return interaction.editReply("Você precisa entrar em um canal de voz.");

    if (channel.id !== player.voiceChannelId) return interaction.editReply("Não estamos no mesmo canal de voz.");

    if (!player.playing) return interaction.editReply({ content: "Não está tocando nenhuma música no momento." });

    const queue = player.queue as DefaultQueue;
    const song = player.current;
    const currentPlaying = `${formatEmoji(settings.emojis.animated.musicBeat, true)} **Tocando agora: [${song?.title}](${song?.uri})**`;

    if (queue.size === 0) {
      const embed = new EmbedBuilder({
        description: `${currentPlaying}\n\n- A fila de músicas está vazia!`,
      });
      return interaction.editReply({ embeds: [embed] });
    }

    let embeds: EmbedBuilder[] = [];
    let currentEmbed = new EmbedBuilder({
      color: hexToRgb(settings.colors.theme.blurple),
      description: `${currentPlaying}`
    });
    let fieldsAdded = 0;

    for (let i = 0; i < queue.size; i++) {
      const track = queue.tracks[i];

      // Adiciona um novo campo para cada faixa na fila
      currentEmbed.addFields({
        name: `${i + 1}. \`${track.title}\``,
        value: `Pedido por: ${track.requester?.toString()}`,
      });

      fieldsAdded++;

      // Se 10 campos foram adicionados ou se é a última faixa na fila
      if (fieldsAdded === 10 || i === queue.size - 1) {
        currentEmbed.setTitle(`Página ${embeds.length + 1}/${Math.ceil(queue.size / 10)}`);
        embeds.push(currentEmbed);
        currentEmbed = new EmbedBuilder().setColor(Colors.Blurple);
        fieldsAdded = 0;
      }
    }

    pagination({
      buttons: {
        previous: { label: "", emoji: `${settings.emojis.static.back}` },
        home: { label: "", emoji: "🏠" },
        next: { label: "", emoji: `${settings.emojis.static.next}` },
        close: { label: "", emoji: `${settings.emojis.static.error}` }
      },
      embeds,
      components: ({ home, close, next, previous }) => [
        new ActionRowBuilder<ButtonBuilder>({
          components: [previous, home, next, close],
        }),
      ],
      render: (embed, components) =>
        interaction.editReply({
          embeds: [embed],
          components,
        }),
      onClick(interaction, embed) {
        interaction.editReply({ embeds: [embed] });
      },
    });
  },
});