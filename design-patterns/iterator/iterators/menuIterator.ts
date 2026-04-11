import type { MenuItem } from "../menuItem.ts"

export interface MenuIterator {
  hasNext(): boolean
  next(): MenuItem
}
