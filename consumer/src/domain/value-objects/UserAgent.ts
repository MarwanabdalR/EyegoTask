export class UserAgent {
  public readonly value: string;

  constructor(value: string) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error('User agent must be a non-empty string.');
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}
