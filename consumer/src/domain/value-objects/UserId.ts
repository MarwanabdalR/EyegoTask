export class UserId {
  public readonly value: string;

  constructor(value: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Invalid user ID');
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}
