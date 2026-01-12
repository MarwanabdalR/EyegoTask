export class ActivityType {
  public static readonly ALLOWED_TYPES = [
    'LOGIN',
    'LOGOUT',
    'VIEW_PAGE',
    'PURCHASE',
  ] as const;

  public readonly value: typeof ActivityType.ALLOWED_TYPES[number];

  constructor(value: string) {
    const upperValue = value.toUpperCase();
    if (!this.isValid(upperValue)) {
      throw new Error(`Invalid activity type: ${value}`);
    }
    this.value = upperValue as typeof ActivityType.ALLOWED_TYPES[number];
  }

  private isValid(value: string): boolean {
    return (ActivityType.ALLOWED_TYPES as readonly string[]).includes(value);
  }

  public toString(): string {
    return this.value;
  }
}
