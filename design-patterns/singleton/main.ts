import { Logger } from "./logger.ts";

// Haal de logger op vanuit verschillende "plekken" in de applicatie
const loggerFromServiceA = Logger.getInstance();
const loggerFromServiceB = Logger.getInstance();

// Beide variabelen verwijzen naar exact dezelfde instantie
console.log("Zelfde instantie?", loggerFromServiceA === loggerFromServiceB);

// Log berichten vanuit verschillende services
loggerFromServiceA.log("Service A is opgestart");
loggerFromServiceB.log("Service B is opgestart");
loggerFromServiceA.warn("Service A: geheugengebruik is hoog");
loggerFromServiceB.error("Service B: verbinding met database verloren");

// Omdat het dezelfde instantie is, bevat de history alles
console.log("\nVolledige log history:");
const logger = Logger.getInstance();
logger.getHistory().forEach((entry) => console.log(`  ${entry}`));
