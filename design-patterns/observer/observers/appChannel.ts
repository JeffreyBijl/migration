import type { Observer } from "./observer.ts";

export class AppChannel implements Observer {
  public update(news: string) {
    console.log(`[App Push Notificatie] ${news}`);
  }
}
