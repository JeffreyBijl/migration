export interface AuftragIni {
  Auftrag: {
    Erstellt: string;
    Art: string;
    AT: string;
    Kundennummer: string;
    Status: string;
    Versendet: string;
  };
  Versand: {
    Versandadresse: string;
    Versandart: string;
    Anzahl: string;
  };
  Kunde: {
    P_Name: string;
    P_Vorname: string;
    P_Geb: string;
    P_Nummer: string;
    INFO: string;
    ANREDE: string;
    TITEL: string;
    STRASSE: string;
    HAUSNUMMER: string;
    PLZ: string;
    ORT: string;
    LAND: string;
    TELEFON: string;
    MOBIL: string;
    MAIL: string;
  };
  Versandadresse: {
    Strasse: string;
    Hausnummer: string;
    Land: string;
    PLZ: string;
    Ort: string;
    NAME: string;
  };
  Einlagentyp: {
    Typ: string;
  };
  Diagnose: {
    Diagnose: string;
  };
  Fusstyp: {
    Typ: string;
  };
  Werkstatt: {
    Bezug: string;
    Fraesmaterial: string;
    Brandsohle: string;
    Schuhgroesse: string;
    Einlagenlaenge: string;
  };
}
