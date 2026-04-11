export class Logger {
  private static instance: Logger;
  private logHistory: string[] = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  public log(message: string): void {
    const entry = `[LOG] ${message}`;
    this.logHistory.push(entry);
    console.log(entry);
  }

  public warn(message: string): void {
    const entry = `[WARN] ${message}`;
    this.logHistory.push(entry);
    console.log(entry);
  }

  public error(message: string): void {
    const entry = `[ERROR] ${message}`;
    this.logHistory.push(entry);
    console.log(entry);
  }

  public getHistory(): string[] {
    return [...this.logHistory];
  }
}
