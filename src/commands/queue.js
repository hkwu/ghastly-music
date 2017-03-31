import { RichEmbed } from 'discord.js';
import YouTubeItem from '../utils/YouTubeItem';
import expectGuild from '../middleware/expectGuild';

export default function queue() {
  async function handler({ formatter, message, services }) {
    const { bold } = formatter;
    const {
      guild: {
        voiceConnection,
      },
    } = message;
    const musicQueue = services.fetch('music.queue');

    if (!voiceConnection) {
      return 'I\'m not in a voice channel, dude.';
    }

    const embed = new RichEmbed();

    embed.setTitle('CURRENT QUEUE').setDescription(`There's ${bold(musicQueue.length)} item(s) in the queue, dude. Keep in mind I'm only showing the first 10.`);

    musicQueue.items
      .slice(0, 10)
      .forEach((item, index) => {
        if (item instanceof YouTubeItem) {
          const { title, publishedAt } = item;

          embed.addField(
            `${index + 1}. ${title} [${publishedAt.getFullYear()}-${publishedAt.getMonth() + 1}-${publishedAt.getDate()}]`,
            '',
          );
        }
      });

    return embed;
  }

  return {
    handler,
    triggers: ['queue'],
    middleware: [
      expectGuild(),
    ],
  };
}
