import { Command } from "@discord/base";
import { ApplicationCommandType, Colors, GuildMember, VoiceState } from "discord.js";

export default new Command({
    name: "resumo",
    description: "[🎵 Música] Retornar a música.",
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
    
        if (!player.paused) return interaction.editReply("A música já está despausada.");
    
        player.pause(false);
        interaction.editReply({ embeds: [{ description: "A música foi retormada.", color: Colors.Green }] });

    },
});