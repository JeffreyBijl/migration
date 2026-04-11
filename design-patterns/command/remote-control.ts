import type { Command } from "./commands/command.ts";

export class RemoteControl {
  private commandHistory: Command[] = [];

  public pressButton(command: Command): void {
    command.execute();
    this.commandHistory.push(command);
  }

  public pressUndo(): void {
    const lastCommand = this.commandHistory.pop();

    if (!lastCommand) {
      console.log("⏪ Geen commands om ongedaan te maken");
      return;
    }

    console.log("⏪ Ongedaan maken...");
    lastCommand.undo();
  }

  public getHistoryLength(): number {
    return this.commandHistory.length;
  }
}
