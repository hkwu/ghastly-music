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
import stop from './commands/stop';

const client = new Client({ prefix: '.' });

client.dispatcher.load(
  join,
  leave,
  pause,
  play,
  queue,
  resume,
  stop,
);

client.services.bind('music.youtube', new YouTube(config.get('YouTube.apiKey')));
client.services.bind('music.queue', new MusicQueue());

client.login(config.get('Discord.botToken'));

client.on('dispatchError', (error) => {
  console.log(error);
});
