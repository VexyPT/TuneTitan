import PresenceManager from "@/extensions/PresenceManager";
import { sleep } from "@/functions";
import { Event } from "@discord/base";
import ck from "chalk";


export default new Event({
    name: "ready",
    once: true,
    async run(client) {
        await sleep(2000);
        console.log(ck.greenBright.underline("\n✓ Everything is working correctly!"));

        const presenceManager = new PresenceManager(client);
        presenceManager.setPresence();
        
        client.vulkava?.start(client.user?.id!);
        client.on("raw", (data) => client.vulkava?.handleVoiceUpdate(data));
    },
});