import type { Observer } from "./observer.ts";

export class EmailChannel implements Observer {
  public update(news: string) {
    console.log(`[Email Nieuwsbrief] ${news}`);
  }
}
