import { Client, ActivityType, PresenceStatusData, PresenceData, ActivitiesOptions } from "discord.js";

class PresenceManager {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async setPresence(): Promise<void> {

    const options = [
      {
        type: ActivityType.Listening,
        text: `🎵 ${this.client.users.cache.size} Usuários.`,
        status: "online"
      },
      {
        type: ActivityType.Playing,
        text: "🎧 Fui criado com intuito de alegrar seu dia.",
        status: "online"
      },
      {
        type: ActivityType.Watching,
        text: "⭐ Estou aqui por você!",
        status: "online"
      }
    ];

    const option = Math.floor(Math.random() * options.length);

    const presenceData: PresenceData = {
      activities: [{
        name: options[option].text,
        type: options[option].type as ActivitiesOptions["type"],
      }],
      status: options[option].status as PresenceStatusData,
    };

    this.client.user?.setPresence(presenceData);
  }
}

export default PresenceManager;
