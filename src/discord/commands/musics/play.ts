import { Command } from "@discord/base";
import { ApplicationCommandOptionType, ApplicationCommandType, formatEmoji } from "discord.js";
import { settings } from "@/settings";
import { hexToRgb } from "@/functions";

export default new Command({
    name: "play",
    description: "[🎵 Música] Tocar uma música.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "música",
            description: "Selecione uma música ou playlist",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],

    async autoComplete(props) {
        let songs = [];

        const res = await props.client.vulkava?.search(props.interaction.options.getString("música") as string);
        switch (res?.loadType) {
            case "LOAD_FAILED":
                break;
            case "NO_MATCHES":
                break;
            case "TRACK_LOADED":
                break;
            case "PLAYLIST_LOADED":
                break;
            case "SEARCH_RESULT":
                songs.push({
                    name: res.tracks[0].title,
                    value: res.tracks[0].uri
                });
                break;
            default:
                break;
        }
        props.interaction.respond(songs);
    },

    async run({ interaction, client }){

        await interaction.deferReply({ ephemeral: false });

        const string = interaction.options.getString("música");

        const res = await client.vulkava?.search(string!);

        const voiceState = interaction.member.voice;

        if (!voiceState || !voiceState.channelId) {
            await interaction.editReply({ embeds: [{ description: `${formatEmoji(settings.emojis.static.warning)} Entre em um canal de voz primeiro.`}]});
            return;
        }

        if (res?.loadType === "LOAD_FAILED") {
            console.log(`Ocorreu um erro no /play: ${res.exception?.message}`);
            return interaction.editReply({ embeds: [{ description: `${formatEmoji(settings.emojis.static.error)} Ocorreu um erro, por favor tente novamente, se percistir o erro será enviado automaticamente para a nossa equipe.`}] });
        } else if (res?.loadType === "NO_MATCHES") {
            return interaction.editReply({ embeds: [{ description: `${formatEmoji(settings.emojis.static.error)} Não foi encontrada nenhuma música com esse nome!`}] });
        }

        const player = client.vulkava?.createPlayer({
            guildId: interaction.guild?.id!,
            voiceChannelId: voiceState.channelId,
            textChannelId: interaction.channelId,
            selfDeaf: true
        });

        player?.connect();

        if (res?.loadType === "PLAYLIST_LOADED") {
            for (const track of res.tracks) {
                track.setRequester(interaction.user);
                player?.queue.add(track);
            }

                const timestamp = res.playlistInfo.duration / 1000;
                const hours = Math.floor(timestamp / 60 / 60);
                const minutes = Math.floor(timestamp / 60) - (hours * 60);
                const seconds = timestamp % 60;
                const secondsFormatted = seconds.toFixed(0);
                const formatted = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + secondsFormatted.toString().padStart(2, "0");

            interaction.editReply({
                embeds: [{
                    title: `Playlist Carregada: ${res.playlistInfo.name}`,
                    description: `Musicas: \`${res.tracks.length}\`\nDuração: \`${formatted}\``,
                    color: hexToRgb(settings.colors.theme.blurple),
                }]
            });
        } else {
            const track = res?.tracks[0];
            track?.setRequester(interaction.user);

            player?.queue.add(track!);
            interaction.editReply({
                embeds: [{
                    color: hexToRgb(settings.colors.theme.blurple),
                    description: `${player!.queue.size <= 1 ? `Adicionado a fila [${track?.title}](${track?.uri}) por \`${track?.author}\`` : `Adicionado à fila na posição \`${player?.queue.size}\`, [${track?.title}](${track?.uri}) por \`${track?.author}\``}`
                }]
            });
        }
        if (!player?.playing) player?.play();
    },
});