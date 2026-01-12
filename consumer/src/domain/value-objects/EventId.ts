import { v4 as uuidv4 } from 'uuid';

export class EventId {
  public readonly value: string;

  constructor(value?: string) {
    this.value = value || uuidv4();
    if (!this.isValid(this.value)) {
      throw new Error(`Invalid event ID: ${this.value}`);
    }
  }

  private isValid(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  public toString(): string {
    return this.value;
  }
}
