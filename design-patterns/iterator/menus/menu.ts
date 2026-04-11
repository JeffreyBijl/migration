import type { MenuIterator } from "../iterators/menuIterator.ts"

export interface Menu {
  createIterator(): MenuIterator
}
