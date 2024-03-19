import { Command } from "@discord/base";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

export default new Command({
    name: "tocar",
    description: "[🎵 Música] Tocar uma música.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "música",
            description: "Selecione uma música",
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
            await interaction.editReply("Entra algum canal de voz primeiro.");
            return;
        }

        if (res?.loadType === "LOAD_FAILED") {
            return interaction.editReply(`Ocorreu um erro: ${res.exception?.message}`);
        } else if (res?.loadType === "NO_MATCHES") {
            return interaction.editReply("Sem matches!");
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
            interaction.editReply(`Playlist \`${res.playlistInfo.name}\` carregada!`);
        } else {
            const track = res?.tracks[0];
            track?.setRequester(interaction.user);

            player?.queue.add(track!);
            interaction.editReply(`Na fila \`${track?.title} - ${player?.queue.size}\``);
        }
        if (!player?.playing) player?.play();
    },
});