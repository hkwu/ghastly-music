import ytdl from 'ytdl-core';
import { RichEmbed } from 'discord.js';
import { VoiceResponse } from 'ghastly/lib/command';

export default function play() {
  async function handler({ args, dispatch, services }) {
    const { query } = args;
    const youtube = services.fetch('music.youtube');

    if (/^https?/i.test(query)) {
      const embed = new RichEmbed();

      try {
        const {
          title,
          description,
          duration,
          url,
        } = await youtube.getVideo(query);

        embed.setTitle(`NOW PLAYING - ${title}`)
          .setDescription(description)
          .setURL(url);

        if (duration) {
          embed.addField('Duration', `${duration.hours}:${duration.minutes}:${duration.seconds}`);
        }

        const stream = ytdl(url, { filter: 'audioonly' });

        await dispatch(embed);

        return new VoiceResponse('stream', stream);
      } catch (error) {
        return 'Had some problem finding that video, dude.';
      }
    }

    try {
      const embed = new RichEmbed();
      const results = await youtube.searchVideos(query);

      embed.setTitle('SEARCH RESULTS').setDescription(`You searched for "${query}".`);

      results.forEach((result, index) => {
        const { title, description, publishedAt } = result;

        embed.addField(
          `${index + 1}. ${title} [${publishedAt.getFullYear()}-${publishedAt.getMonth() + 1}-${publishedAt.getDate()}]`,
          description,
        );
      });

      return embed;
    } catch (error) {
      return 'Had some problem finding that video, dude.';
    }
  }

  return {
    handler,
    triggers: ['play'],
    parameters: ['query...'],
  };
}
