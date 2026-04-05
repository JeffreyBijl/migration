import { podozorgConfig } from "./configs/podozorg.config.ts";
import { Migration } from "./migration.ts";

const migration = new Migration();

migration.start(podozorgConfig);
