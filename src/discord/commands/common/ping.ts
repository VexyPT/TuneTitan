import { Command } from "@discord/base";
import { ApplicationCommandType } from "discord.js";

export default new Command({
    name: "ping",
    description: "[📜 Common] Veja a ping da API.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run({ interaction, client }){

        await interaction.deferReply({ ephemeral: false });

        await interaction.editReply(`:ping_pong: **Latência da API:** ${Math.round(client.ws.ping)}ms`);
    },
});