import { expectGuild } from 'ghastly/middleware';

export default function skip() {
  async function handler({
    dispatch, formatter, message, services,
  }) {
    const { bold } = formatter;
    const {
      guild: {
        voiceConnection: {
          player: {
            dispatcher,
          },
        },
      },
    } = message;
    const queue = services.get('music.queue');

    if (!queue.length) {
      return 'Dude, there\'s nothing in the queue.';
    }

    const item = queue.peek();

    await dispatch(`Successfully skipped ${bold(item.title)}.`);

    return dispatcher.end();
  }

  return {
    handler,
    triggers: ['skip'],
    middleware: [
      expectGuild(),
    ],
  };
}
