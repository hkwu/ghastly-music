import expectGuild from '../middleware/expectGuild';

export default function resume() {
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
    } else if (!dispatcher.paused) {
      return 'I\'m already playing, dude.';
    }

    dispatcher.resume();

    return 'Alright, restarting the party.';
  }

  return {
    handler,
    triggers: ['resume'],
    middleware: [
      expectGuild(),
    ],
  };
}
