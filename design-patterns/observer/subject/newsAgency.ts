import type { Observer } from "../observers/observer.ts";
import type { Subject } from "./subject.ts";

export class NewsAgency implements Subject {
  private observers: Observer[] = [];

  public subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((existing) => existing !== observer);
  }

  public publishNews(news: string) {
    this.updateObservers(news);
  }

  private updateObservers(news: string) {
    for (const observer of this.observers) {
      observer.update(news);
    }
  }
}
