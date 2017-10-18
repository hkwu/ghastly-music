import { RichEmbed } from 'discord.js';
import { expectGuild } from 'ghastly/middleware';
import YouTubeItem from '../utils/YouTubeItem';

export default function queue() {
  async function handler({ formatter, message, services }) {
    const { bold } = formatter;
    const {
      guild: {
        voiceConnection,
      },
    } = message;
    const musicQueue = services.get('music.queue');

    if (!voiceConnection) {
      return 'I\'m not in a voice channel, dude.';
    }

    const embed = new RichEmbed();

    embed.setTitle('CURRENT QUEUE').setDescription(`There's ${bold(musicQueue.length)} item(s) in the queue, dude. Keep in mind I'm only showing the first 10.`);

    musicQueue.items
      .slice(0, 10)
      .forEach((item, index) => {
        if (item instanceof YouTubeItem) {
          const { title, description, publishedAt } = item;

          embed.addField(
            `${index + 1}. ${title} [${publishedAt.getFullYear()}-${publishedAt.getMonth() + 1}-${publishedAt.getDate()}]`,
            description.match(/(.+)\n/)[1],
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
