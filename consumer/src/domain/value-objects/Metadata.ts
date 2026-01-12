export class Metadata {
  public readonly value: Record<string, any>;

  constructor(value?: Record<string, any>) {
    this.value = value || {};
  }

  public toObject(): Record<string, any> {
    return this.value;
  }
}
