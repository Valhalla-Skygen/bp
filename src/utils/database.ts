import World from "./wrappers/world";

export default class Database<T> {
  public constructor(private readonly name: string) {}

  public Set(key: string, data?: Partial<T>): void {
    World.SetProperty(this.FormatKey(key), data);
  }
  public Get(key: string): T | undefined {
    return World.GetProperty<T>(this.FormatKey(key));
  }

  public Keys(): string[] {
    return World.PropertyKeys(this.name).map((key) =>
      key.replace(`${this.name}:`, "")
    );
  }

  public Entries(): Record<string, T> {
    const entries: Record<string, T> = {};

    for (const key of this.Keys()) {
      entries[key] = this.Get(key) as T;
    }

    return entries;
  }

  public Clear(): void {
    for (const key of this.Keys()) {
      this.Set(key);
    }
  }

  private FormatKey(baseKey: string): string {
    return this.name + ":" + baseKey;
  }
}
