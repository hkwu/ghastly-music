import expectGuild from '../middleware/expectGuild';

export default function leave() {
  async function handler({ message, services }) {
    const {
      guild: {
        voiceConnection,
      },
    } = message;
    const queue = services.fetch('music.queue');

    if (!voiceConnection) {
      return 'I\'m not in a voice channel, dude.';
    }

    voiceConnection.channel.leave();
    queue.clear();

    return 'See ya, dude!';
  }

  return {
    handler,
    triggers: ['leave'],
    middleware: [
      expectGuild(),
    ],
  };
}
