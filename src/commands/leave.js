import expectGuild from '../middleware/expectGuild';

export default function leave() {
  async function handler({ message }) {
    const {
      guild: {
        voiceConnection,
      },
    } = message;

    if (!voiceConnection) {
      return 'I\'m not in a voice channel, dude.';
    }

    voiceConnection.channel.leave();

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
