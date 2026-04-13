export interface PodozorgAuftrag {
  Auftrag: {
    Kundennummer: string;
    AT?: string;
    Art?: string;
    Erstellt?: string;
    Status?: string;
    Versendet?: string;
    AT_Alt?: string;
  };
  Kunde: {
    P_Nummer: string;
    P_Name: string;
    P_Vorname?: string;
    P_Geb: string;
    INFO?: string;
    ANREDE?: string;
    TITEL?: string;
    STRASSE?: string;
    HAUSNUMMER?: string;
    PLZ?: string;
    ORT?: string;
    LAND?: string;
    TELEFON?: string;
    MOBIL?: string;
    MAIL?: string;
  };
  Diagnose?: {
    Diagnose?: string;
  };
  Fusstyp?: {
    Typ?: string;
  };
  Versand?: {
    Versandart?: string;
  };
  Versandadresse?: {
    NAME?: string;
  };
}
