export default class MusicQueue {
  constructor() {
    this.queue = [];

    this.queued = new Set();
  }

  get length() {
    return this.queue.length;
  }

  get items() {
    return [...this.queue];
  }

  enqueue(item) {
    if (!this.queued.has(item.id)) {
      this.queue.push(item);
      this.queued.add(item.id);
    }
  }

  dequeue() {
    const item = this.queue.shift();

    this.queued.delete(item.id);

    return item;
  }

  peek() {
    return this.queue[0];
  }

  clear() {
    this.queue = [];
    this.queued.clear();
  }
}
