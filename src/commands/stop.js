import { expectGuild } from 'ghastly/middleware';

export default function stop() {
  async function handler({ message }) {
    const {
      guild: {
        voiceConnection,
      },
    } = message;

    if (!voiceConnection) {
      return 'I\'m not in a voice channel, dude.';
    }

    const {
      player: {
        dispatcher,
      },
    } = voiceConnection;

    if (!dispatcher) {
      return 'I\'m not playing anything, dude.';
    }

    return dispatcher.end();
  }

  return {
    handler,
    triggers: ['stop'],
    middleware: [
      expectGuild(),
    ],
  };
}
