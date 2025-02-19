/**
 * Simple mutex implementation for thread safety.
 */
export class Lock {
  private locked: boolean = false;
  private queue: Array<(value: boolean) => void> = [];

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) next(true);
    } else {
      this.locked = false;
    }
  }
}