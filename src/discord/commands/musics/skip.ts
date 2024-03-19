import { Command } from "@discord/base";
import { ApplicationCommandType, Colors, GuildMember, VoiceState } from "discord.js";

export default new Command({
    name: "pular",
    description: "[🎵 Música] Pular a música.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,

    async run({ interaction, client }) {

        await interaction.deferReply({ ephemeral: false });

        const member = interaction.member as GuildMember;

        const player = client.vulkava?.players.get(interaction.guild?.id!);

        if (!player) {
            return interaction.editReply({
                content: "O servidor não possui nenhum player ativo.",
            });
        }

        const { channel } = member.voice as VoiceState;

        if (!channel) {
            return interaction.editReply("Você precisa está conectado em um canal");
        }

        if (channel.id !== player.voiceChannelId) {
            return interaction.editReply("Não estamos no mesmo canal de voz.");
        }

        if (player.queue.size === 0) {
            player.destroy();

            interaction.editReply("👌🏻");
        } else {
            const song = player.current;
            player.skip();

            interaction.editReply({ embeds: [{ description: `✅ [${song?.title}](${song?.uri}) foi trocada.`, color: Colors.Green }] });
        }

    },
});