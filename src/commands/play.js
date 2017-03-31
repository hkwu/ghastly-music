import ytdl from 'ytdl-core';
import { RichEmbed } from 'discord.js';
import { VoiceResponse } from 'ghastly/lib/command';
import expectGuild from '../middleware/expectGuild';

function generateEmbed(data) {
  const {
    title,
    description,
    duration,
    channelTitle,
    url,
  } = data;

  const embed = new RichEmbed();

  embed.setTitle(`[NOW PLAYING] ${title}`)
    .setDescription(description)
    .setURL(url);

  if (duration) {
    const { hours, minutes, seconds } = duration;

    embed.addField('Duration', `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, true);
  }

  embed.addField('Channel', channelTitle, true);

  return embed;
}

export default function play() {
  async function handler({ args, dispatch, message, services }) {
    const { query } = args;
    const {
      channel,
      member: {
        id,
      },
      guild: {
        voiceConnection,
      },
    } = message;
    const youtube = services.fetch('music.youtube');

    if (!voiceConnection) {
      return 'I\'m not in a voice channel, dude.';
    }

    if (/^https?/i.test(query)) {
      try {
        const {
          title,
          description,
          duration,
          url,
          channel: {
            title: channelTitle,
          },
        } = await youtube.getVideo(query);

        await dispatch(generateEmbed({
          title,
          description,
          duration,
          channelTitle,
          url,
        }));

        const stream = ytdl(url, { filter: 'audioonly' });
        const dispatcher = await dispatch(new VoiceResponse('stream', stream));

        return dispatcher.once('end', () => {
          voiceConnection.disconnect();
          dispatch('Party\'s over, dude!');
        });
      } catch (error) {console.log(error)
        return 'Had some problem finding that video, dude.';
      }
    }

    try {
      const embed = new RichEmbed();
      const results = await youtube.searchVideos(query);

      embed.setTitle('SEARCH RESULTS').setDescription(`You searched for "${query}". To play a video, enter the result number of the video (e.g. "1" to play the first result) within 60 seconds.`);

      results.forEach((result, index) => {
        const { title, description, publishedAt } = result;

        embed.addField(
          `${index + 1}. ${title} [${publishedAt.getFullYear()}-${publishedAt.getMonth() + 1}-${publishedAt.getDate()}]`,
          description,
        );
      });

      await dispatch(embed);

      try {
        const collected = await channel.awaitMessages((collectedMessage) => {
          const {
            content,
            member: {
              id: collectedId,
            },
          } = collectedMessage;

          return collectedId === id && /^[1-5]$/.test(content);
        }, {
          time: 60 * 1000,
          maxMatches: 1,
          errors: ['time'],
        });

        const { content } = collected.first();
        const {
          title,
          description,
          url,
          channel: {
            title: channelTitle,
          },
        } = results[parseInt(content, 10) - 1];
        const { duration } = await youtube.getVideo(url);

        await dispatch(generateEmbed({
          title,
          description,
          duration,
          channelTitle,
          url,
        }));

        const stream = ytdl(url, { filter: 'audioonly' });
        const dispatcher = await dispatch(new VoiceResponse('stream', stream));

        return dispatcher.once('end', () => {
          voiceConnection.disconnect();
          dispatch('Party\'s over, dude!');
        });
      } catch (error) {
        return 'You didn\'t choose a video to play, dude. Forget about it.';
      }
    } catch (error) {
      return 'Had some problem finding that video, dude.';
    }
  }

  return {
    handler,
    triggers: ['play'],
    parameters: ['query...'],
    middleware: [
      expectGuild(),
    ],
  };
}
