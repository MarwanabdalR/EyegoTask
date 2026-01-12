export class Version {
  public readonly value: string;

  constructor(value?: string) {
    this.value = value || '1.0';
    // Optional: Add semantic versioning validation if needed
  }

  public toString(): string {
    return this.value;
  }
}
