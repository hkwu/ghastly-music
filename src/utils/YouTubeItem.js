import ytdl from 'ytdl-core';
import { RichEmbed } from 'discord.js';
import QueueItem from './QueueItem';

export default class YouTubeItem extends QueueItem {
  constructor(video) {
    const {
      channel,
      description,
      duration,
      id,
      publishedAt,
      title,
      url,
    } = video;

    super({ id: `YouTube-${id}`, title });

    this.channel = channel;

    this.description = description;

    this.duration = duration;

    this.publishedAt = publishedAt;

    this.url = url;

    this.rawId = id;
  }

  get embed() {
    const embed = new RichEmbed();

    embed.setTitle(`[NOW PLAYING] ${this.title}`)
      .setDescription(this.description)
      .setURL(this.url)
      .addField('Duration', this.formattedDuration, true)
      .addField('Channel', this.channel.title, true);

    return embed;
  }

  get formattedDuration() {
    const { hours, minutes, seconds } = this.duration;

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  createStream() {
    return ytdl(this.url, { filter: 'audioonly' });
  }
}
