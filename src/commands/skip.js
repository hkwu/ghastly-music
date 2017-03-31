import expectGuild from '../middleware/expectGuild';

export default function skip() {
  async function handler({ formatter, message, services }) {
    const { bold } = formatter;
    const queue = services.fetch('music.queue');

    if (!queue.length) {
      return 'Dude, there\'s nothing in the queue.';
    }

    const item = queue.dequeue();

    return `Successfully skipped ${bold(item.title)}.`;
  }

  return {
    handler,
    triggers: ['skip'],
    middleware: [
      expectGuild(),
    ],
  };
}
