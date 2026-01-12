export class LogTimestamp {
  public readonly value: Date;

  constructor(value?: Date) {
    this.value = value || new Date();
  }

  public toISOString(): string {
    return this.value.toISOString();
  }

  public toDate(): Date {
    return this.value;
  }
}
