import { NewsAgency } from "./subject/newsAgency.ts";
import { AppChannel } from "./observers/appChannel.ts";
import { EmailChannel } from "./observers/emailChannel.ts";
import { WebsiteChannel } from "./observers/websiteChannel.ts";

const newsAgency = new NewsAgency();

const appChannel = new AppChannel();
const emailChannel = new EmailChannel();
const websiteChannel = new WebsiteChannel();

// Alle kanalen abonneren
newsAgency.subscribe(appChannel);
newsAgency.subscribe(emailChannel);
newsAgency.subscribe(websiteChannel);

// Eerste nieuwsbericht: alle kanalen ontvangen het
console.log("--- Eerste bericht ---");
newsAgency.publishNews("Nederland wint het EK!");

// Email kanaal meldt zich af
newsAgency.unsubscribe(emailChannel);

// Tweede nieuwsbericht: alleen app en website ontvangen het
console.log("--- Tweede bericht (email afgemeld) ---");
newsAgency.publishNews("Hittegolf verwacht deze week");
