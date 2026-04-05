import { appendFileSync, writeFileSync } from "fs";

export class Logger {
  private counts = { info: 0, warn: 0, error: 0 };

  constructor(private readonly logFilePath: string) {
    writeFileSync(this.logFilePath, "");
  }

  info(message: string): void {
    this.log("INFO", message);
    this.counts.info++;
  }

  warn(message: string): void {
    this.log("WARN", message);
    this.counts.warn++;
  }

  error(message: string): void {
    this.log("ERROR", message);
    this.counts.error++;
  }

  summary(): void {
    console.log(
      `\nSummary: ${this.counts.info} info, ${this.counts.warn} warnings, ${this.counts.error} errors`,
    );
  }

  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    const line = `[${timestamp}] [${level}] ${message}\n`;
    appendFileSync(this.logFilePath, line);
  }
}
