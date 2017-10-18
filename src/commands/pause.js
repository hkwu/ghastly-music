import { expectGuild } from 'ghastly/middleware';

export default function pause() {
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

    if (!dispatcher || dispatcher.paused) {
      return 'I\'m not playing anything, dude.';
    }

    dispatcher.pause();

    return 'Alright, stopping the party.';
  }

  return {
    handler,
    triggers: ['pause'],
    middleware: [
      expectGuild(),
    ],
  };
}
