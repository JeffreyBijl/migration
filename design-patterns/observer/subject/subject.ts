import type { Observer } from "./observer.ts";

export interface Subject {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  publishNews(news: string): void;
}
