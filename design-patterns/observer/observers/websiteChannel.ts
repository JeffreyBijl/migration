import type { Observer } from "./observer.ts";

export class WebsiteChannel implements Observer {
  public update(news: string) {
    console.log(`[Website Banner] ${news}`);
  }
}
