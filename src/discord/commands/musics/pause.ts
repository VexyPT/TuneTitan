import { Command } from "@discord/base";
import { ApplicationCommandType, Colors, GuildMember, VoiceState } from "discord.js";

export default new Command({
    name: "pausar",
    description: "[🎵 Música] Pausar uma música.",
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

        if (player.paused) return interaction.editReply("A música já está pausada.");

        player.pause(true);
        interaction.editReply({ embeds: [{ description: "Música pausada.", color: Colors.Green }] });

    },
});