import { hexToRgb } from "@/functions";
import { settings } from "@/settings";
import { Command } from "@discord/base";
import { ApplicationCommandType, ApplicationCommandOptionType, Colors, GuildMember, VoiceState } from "discord.js";
import { DefaultQueue } from "vulkava";

export default new Command({
    name: "shuffle",
    description: "[🎵 Música] Ative o modo shuffle",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run({ interaction, client }) {

        await interaction.deferReply({ ephemeral: false });

        const member = interaction.member as GuildMember;
        const player = client.vulkava?.players.get(interaction.guild?.id!);

        if (!player) return interaction.editReply({ embeds: [{ description: "O servidor não possui nenhum player ativo.", color: Colors.Red }] });

        const { channel } = member.voice as VoiceState;
        if (!channel) return interaction.editReply("Você precisa entrar em um canal de voz.");
        if (channel.id !== player.voiceChannelId) return interaction.editReply("Não estamos no mesmo canal de voz.");
    
        const queue = player?.queue as DefaultQueue;
        queue.shuffle();
        
        await interaction.editReply({
            content: "Modo shuffle ativado!",
        });

    },
});