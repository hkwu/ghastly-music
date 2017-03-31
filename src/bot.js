import YouTube from 'simple-youtube-api';
import config from 'config';
import { Client } from 'ghastly';
import join from './commands/join';
import leave from './commands/leave';
import play from './commands/play';

const client = new Client({ prefix: '.' });

client.dispatcher.load(
  join,
  leave,
  play,
);

client.services.bind('music.youtube', new YouTube(config.get('YouTube.apiKey')));

client.login(config.get('Discord.botToken'));

client.on('dispatchError', (error) => {
  console.log(error);
});
