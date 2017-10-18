import YouTube from 'simple-youtube-api';
import config from 'config';
import { Client } from 'ghastly';
import MusicQueue from './utils/MusicQueue';
import join from './commands/join';
import leave from './commands/leave';
import pause from './commands/pause';
import play from './commands/play';
import queue from './commands/queue';
import resume from './commands/resume';
import skip from './commands/skip';
import stop from './commands/stop';

const client = new Client({ prefix: '.' });

client.commands.add(
  join,
  leave,
  pause,
  play,
  queue,
  resume,
  skip,
  stop,
);

client.services.instance('music.youtube', new YouTube(config.get('YouTube.apiKey')));
client.services.instance('music.queue', new MusicQueue());

client.login(config.get('Discord.botToken'));

client.on('dispatchFail', (reason, context) => {
  console.log(reason, context.error);
});
