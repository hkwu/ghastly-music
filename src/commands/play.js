import { RichEmbed } from 'discord.js';
import { VoiceResponse } from 'ghastly/lib/command';
import YouTubeItem from '../utils/YouTubeItem';
import expectGuild from '../middleware/expectGuild';

async function playVideo(queue, dispatch) {
  const video = queue.peek();

  await dispatch(video.embed);

  const dispatcher = await dispatch(new VoiceResponse('stream', video.createStream()));

  return dispatcher.once('end', () => {
    queue.dequeue();

    if (queue.length) {
      return playVideo(queue, dispatch);
    }

    return dispatch('Party\'s over, dude!');
  });
}

export default function play() {
  async function handler({ args, dispatch, formatter, message, services }) {
    const { query } = args;
    const { bold } = formatter;
    const {
      channel,
      member: {
        id,
      },
      guild: {
        voiceConnection,
      },
    } = message;
    const queue = services.fetch('music.queue');
    const youtube = services.fetch('music.youtube');

    if (!voiceConnection) {
      return 'I\'m not in a voice channel, dude.';
    }

    let video;

    if (/^https?/i.test(query)) {
      try {
        video = new YouTubeItem(await youtube.getVideo(query));
      } catch (error) {
        return 'Had some problem finding that video, dude.';
      }
    } else {
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
          const { url } = results[parseInt(content, 10) - 1];
          video = new YouTubeItem(await youtube.getVideo(url));
        } catch (error) {
          return 'You didn\'t choose a video to play, dude. Forget about it.';
        }
      } catch (error) {
        return 'Had some problem finding that video, dude.';
      }
    }

    queue.enqueue(video);

    await dispatch(`Successfully queued ${bold(video.title)}.`);

    if (queue.length === 1) {
      return playVideo(queue, dispatch);
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
