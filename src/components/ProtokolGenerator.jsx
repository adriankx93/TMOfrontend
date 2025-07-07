import { useState } from "react";

// Funkcja do wyciągania wartości z par tabeli
function getValueFromTable(doc, opis) {
  const opisCells = Array.from(doc.querySelectorAll('.nportal_opis'));
  for (const cell of opisCells) {
    if (cell.textContent.replace(/[\s:]/g, '').toLowerCase().includes(opis.toLowerCase())) {
      const wartosc = cell.nextElementSibling;
      if (wartosc) return wartosc.textContent.trim();
    }
  }
  return "";
}

// Wyciąganie tekstu treści (z tagami <br>, \n, itp)
function getTrescValue(doc) {
  const opisCells = Array.from(doc.querySelectorAll('.nportal_opis'));
  for (const cell of opisCells) {
    if (cell.textContent.replace(/[\s:]/g, '').toLowerCase() === 'treść') {
      const wartosc = cell.nextElementSibling;
      if (wartosc) return wartosc.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/\n+/g, '\n').replace(/<\/?.*?>/g, '').trim();
    }
  }
  return "";
}

export default function ProtokolGenerator() {
  const [url, setUrl] = useState("");
  const [dane, setDane] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setDane(null);
    setLoading(true);

    try {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("Błąd pobierania");
      const html = await res.text();

      // Tworzymy DOM z pobranego HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Numer zgłoszenia (z nagłówka)
      let numer = "";
      const naglowek = doc.querySelector('.dcell_sht, .dcell_pht');
      if (naglowek) {
        const match = naglowek.textContent.match(/NR\s+([A-Z0-9]+)/i);
        if (match) numer = match[1];
      }

      // Remedy (w sekcji z "Remedy INC:")
      let remedy = "";
      const btnClipboard = doc.querySelector('#btn[data-clipboard-text]');
      if (btnClipboard) {
        const text = btnClipboard.getAttribute('data-clipboard-text');
        const remedyMatch = text.match(/Remedy INC:([A-Z0-9]+)/);
        if (remedyMatch) remedy = remedyMatch[1];
      }

      // Typ, Zgłaszający, Data zgłoszenia, Data rejestracji, Status, Data wymagana, Adres
      const typ = getValueFromTable(doc, "TYP");
      const zglaszajacy = getValueFromTable(doc, "ZGŁASZAJĄCY");
      const status = getValueFromTable(doc, "STATUS");
      const dataZgloszenia = getValueFromTable(doc, "Data zgłoszenia");
      const dataRejestracji = getValueFromTable(doc, "Data rejestracji");
      const dataWymagana = getValueFromTable(doc, "Data wymagana");
      const adres = getValueFromTable(doc, "ADRES");

      // Treść - całość, w tym email, tel, lokalizacja, opis
      const tresc = getTrescValue(doc);

      // Wyciągamy dodatkowe dane z treści
      let email = "", tel = "", opis = "", lokalizacja = "";
      if (tresc) {
        const emailMatch = tresc.match(/email *: *([^,]+)/i);
        email = emailMatch ? emailMatch[1].trim() : "";
        const telMatch = tresc.match(/tel *: *([0-9 ]+)/i);
        tel = telMatch ? telMatch[1].trim() : "";
        // Lokalizacja i opis: po 'nr pomieszczenia :' i za przecinkiem
        const lokalizacjaMatch = tresc.match(/nr pomieszczenia *: *([^,]+),/i);
        lokalizacja = lokalizacjaMatch ? lokalizacjaMatch[1].trim() : "";
        // Opis: po przecinku
        const opisMatch = tresc.split('nr pomieszczenia').pop()?.split(',').pop();
        opis = opisMatch ? opisMatch.trim() : "";
      }

      setDane({
        numer, remedy, typ, zglaszajacy, status,
        dataZgloszenia, dataRejestracji, dataWymagana,
        adres, tresc, email, tel, lokalizacja, opis
      });
    } catch (e) {
      console.error(e);
      setError("Nie udało się pobrać lub sparsować danych. Sprawdź URL i strukturę strony.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Generator protokołu zgłoszenia SPIE</h1>
      <input
        type="text"
        className="w-full border p-2 rounded"
        placeholder="Wklej link do zgłoszenia (np. https://portal.spie.fm/zgloszenia_link.php?opc=...)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded mt-2 disabled:opacity-50"
        onClick={handleGenerate}
        disabled={!url || loading}
      >
        {loading ? "Generuję..." : "Generuj protokół"}
      </button>

      {error && <div className="text-red-600">{error}</div>}

      {dane && (
        <div className="border p-4 bg-gray-50 rounded mt-6 print:mt-0" id="protokol-print">
          <h2 className="font-bold text-lg mb-2 text-center">KARTA ZGŁOSZENIA</h2>
          <div><b>Nr zgłoszenia:</b> {dane.numer}</div>
          <div><b>Remedy:</b> {dane.remedy}</div>
          <div><b>Typ:</b> {dane.typ}</div>
          <div><b>Zgłaszający:</b> {dane.zglaszajacy}</div>
          <div><b>Status:</b> {dane.status}</div>
          <div><b>Data zgłoszenia:</b> {dane.dataZgloszenia}</div>
          <div><b>Data rejestracji:</b> {dane.dataRejestracji}</div>
          <div><b>Termin realizacji:</b> {dane.dataWymagana}</div>
          <div><b>Adres:</b> {dane.adres}</div>
          <div><b>Email:</b> {dane.email}</div>
          <div><b>Telefon:</b> {dane.tel}</div>
          <div><b>Lokalizacja:</b> {dane.lokalizacja}</div>
          <div><b>Opis awarii:</b><br />{dane.opis}</div>
          <div className="mt-2"><b>Treść oryginalna:</b><br /><pre>{dane.tresc}</pre></div>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded mt-4 print:hidden"
            onClick={() => window.print()}
          >
            Drukuj protokół
          </button>
        </div>
      )}
    </div>
  );
}
