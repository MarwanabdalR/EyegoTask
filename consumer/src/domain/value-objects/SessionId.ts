export class SessionId {
  public readonly value: string;

  constructor(value: string) {
    // Basic validation: ensure it's a non-empty string
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Invalid session ID');
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}
