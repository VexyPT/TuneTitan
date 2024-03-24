import { hexToRgb } from "@/functions";
import { settings } from "@/settings";
import { Command } from "@discord/base";
import { ApplicationCommandType, ApplicationCommandOptionType, Colors, GuildMember, VoiceState } from "discord.js";

export default new Command({
    name: "volume",
    description: "[🎵 Música] Altere o volume de uma música. (default: 50)",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "volume",
        description: "Define o volume da música",
        type: ApplicationCommandOptionType.Integer,
        required: true
    }],
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
        
        const volume = interaction.options.getInteger("volume", true);
    
        if (volume < 0 || volume > 150) {
            return interaction.editReply("O volume deve estar entre 0 e 150.");
        }
    
        player.filters.setVolume(volume);
        
        interaction.editReply({
            embeds:
                [{
                    description: `Volume da musica alterado para \`${volume}\`.`,
                    color: hexToRgb(settings.colors.theme.blurple),
                }]
            });

    },
});