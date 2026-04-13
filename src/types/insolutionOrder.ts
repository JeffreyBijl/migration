import type { Order } from "../generated.ts";

// TODO: external_order_number staat in mapping CSV maar nog niet in
// generated Order. Komt later mee uit generated; veld voor nu hier
// toegevoegd zodat de mapper compileert.
export type InsolutionOrder = Omit<Order, "__typename"> & {
  external_order_number: string;
};
