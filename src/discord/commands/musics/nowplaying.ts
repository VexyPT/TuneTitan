import { hexToRgb } from "@/functions";
import { settings } from "@/settings";
import { Command } from "@discord/base";
import { ApplicationCommandType, Colors, GuildMember, VoiceState } from "discord.js";

export default new Command({
    name: "now-playing",
    description: "[🎵 Música] Veja a música que está tocando no momento.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run({ interaction, client }) {


        await interaction.deferReply({ ephemeral: false });

        const member = interaction.member as GuildMember;

        const player = client.vulkava?.players.get(interaction.guild?.id!);

        if (!player)
            return interaction.editReply({
                embeds: [{ description: "O servidor não possui nenhum player ativo.", color: Colors.Red }],
            });

        const { channel } = member.voice as VoiceState;

        if (!channel) return interaction.editReply("Você precisa entrar em um canal de voz.");

        if (channel.id !== player.voiceChannelId) return interaction.editReply("Não estamos no mesmo canal de voz.");
            
        const song = player.current;
        const timestamp = song!.duration / 1000;
        const hours = Math.floor(timestamp / 60 / 60);
        const minutes = Math.floor(timestamp / 60) - (hours * 60);
        const seconds = timestamp % 60;
        const secondsFormatted = seconds.toFixed(0);
        const formatted = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + secondsFormatted.toString().padStart(2, "0");

        await interaction.editReply({
            embeds: [{
                // eslint-disable-next-line camelcase
                author: { name: "Tocando Agora:", icon_url: `${interaction.guild?.iconURL()}` },
                description: `[${song?.title}](${song?.uri})\n\n> ⏰**・Duração:** \`${formatted}\` [<t:${song?.duration}:R>]\n> 💠**・Por:** \`${song?.author}\`\n> 🖐️**・Pedido por:** ${(song?.requester as never | string).toString()}\n> 🔊**・Volume:** \`${player?.volume}%\`\n> ♾️**・Modo 24/7:** \`Em breve\`\n> 🛜**・Canal de voz:** <#${player.voiceChannelId}>`,
                image: { url: `${song?.thumbnail}` },
                color: hexToRgb(settings.colors.theme.blurple),
            }]
        });

    },
});