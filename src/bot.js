import YouTube from 'simple-youtube-api';
import config from 'config';
import { Client } from 'ghastly';
import join from './commands/join';
import leave from './commands/leave';
import pause from './commands/pause';
import play from './commands/play';
import resume from './commands/resume';

const client = new Client({ prefix: '.' });

client.dispatcher.load(
  join,
  leave,
  pause,
  play,
  resume,
);

client.services.bind('music.youtube', new YouTube(config.get('YouTube.apiKey')));

client.login(config.get('Discord.botToken'));

client.on('dispatchError', (error) => {
  console.log(error);
});
