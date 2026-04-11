import { CarStore } from "./carStore.ts";
import { MotorcycleStore } from "./motorcycleStore.ts";
import { BicycleStore } from "./bicycleStore.ts";

const carStore = new CarStore();
const motorcycleStore = new MotorcycleStore();
const bicycleStore = new BicycleStore();

carStore.orderVehicle();
console.log("---");
motorcycleStore.orderVehicle();
console.log("---");
bicycleStore.orderVehicle();
