import expectGuild from '../middleware/expectGuild';

export default function join() {
  async function handler({ message }) {
    const {
      guild: {
        voiceConnection,
      },
      member: {
        voiceChannel,
        voiceChannelID,
      },
    } = message;

    if (!voiceChannel) {
      return 'You aren\'t in a voice channel, dude.';
    } else if (voiceConnection && voiceChannelID === voiceConnection.channel.id) {
      return 'I\'m already in your voice channel, dude.';
    } else if (!(voiceChannel.joinable && voiceChannel.speakable)) {
      return 'I can\'t join and/or speak in your voice channel, dude.';
    }

    try {
      await voiceChannel.join();

      return 'Let\'s get the party started!';
    } catch (error) {
      return 'Had a problem joining your party, dude. Try again.';
    }
  }

  return {
    handler,
    triggers: ['join'],
    middleware: [
      expectGuild(),
    ],
  };
}
