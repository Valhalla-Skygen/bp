export default class Logger {
  public static Debug(...data: unknown[]): void {
    console.log(
      `[${new Date().toLocaleString()}]`,
      "[DEBUG]",
      ...this.Map(data)
    );
  }
  public static Info(...data: unknown[]): void {
    console.log(
      `[${new Date().toLocaleString()}]`,
      "[INFO]",
      ...this.Map(data)
    );
  }
  public static Notice(...data: unknown[]): void {
    console.log(
      `[${new Date().toLocaleString()}]`,
      "[NOTICE]",
      ...this.Map(data)
    );
  }
  public static Warn(...data: unknown[]): void {
    console.log(
      `[${new Date().toLocaleString()}]`,
      "[WARN]",
      ...this.Map(data)
    );
  }
  public static Error(...data: unknown[]): void {
    console.log(
      `[${new Date().toLocaleString()}]`,
      "[ERROR]",
      ...this.Map(data)
    );
  }
  public static Fatal(...data: unknown[]): void {
    console.log(
      `[${new Date().toLocaleString()}]`,
      "[FATAL]",
      ...this.Map(data)
    );
  }

  private static Map(values: unknown[]): unknown[] {
    const mapped: unknown[] = [];

    for (const value of values) {
      switch (typeof value) {
        case "string":
          mapped.push(value);
          break;
        case "boolean":
          mapped.push(value);
          break;
        case "number":
          mapped.push(value.toString());
          break;
        case "object":
          mapped.push(JSON.stringify(value, null, 2));
          break;
        default:
          mapped.push(value);
      }
    }

    return mapped;
  }
}
