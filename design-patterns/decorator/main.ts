import { Espresso } from "./beverages/espresso.ts";
import { HouseBlend } from "./beverages/houseBlend.ts";
import { Milk } from "./toppings/milk.ts";
import { WhippedCream } from "./toppings/whippedCream.ts";
import { Caramel } from "./toppings/caramel.ts";

// Simpele espresso zonder toppings
const espresso = new Espresso();
console.log(`${espresso.getDescription()} — €${espresso.getCost().toFixed(2)}`);

// House Blend met melk en slagroom
const houseBlend = new WhippedCream(new Milk(new HouseBlend()));
console.log(`${houseBlend.getDescription()} — €${houseBlend.getCost().toFixed(2)}`);

// Espresso met dubbele karamel en slagroom
const fancyEspresso = new WhippedCream(new Caramel(new Caramel(new Espresso())));
console.log(`${fancyEspresso.getDescription()} — €${fancyEspresso.getCost().toFixed(2)}`);
