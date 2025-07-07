import React, { useState } from "react";

export default function ProtokolGenerator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dane, setDane] = useState(null);
  const [error, setError] = useState(null);

  // --------- POBIERZ I PRZETWÓRZ HTML Z LINKU ---------
  const fetchAndParse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDane(null);

    try {
      // Pobierz HTML
      const res = await fetch(url, { credentials: "omit" });
      if (!res.ok) throw new Error("Nie udało się pobrać strony!");
      const html = await res.text();

      // Zamień na DOM i wyciągnij kluczowe dane
      const doc = new DOMParser().parseFromString(html, "text/html");

      // Funkcja pomocnicza do pobierania wartości po opisie (np. "ZGŁASZAJACY:")
      const getField = (label) => {
        const labelEl = Array.from(doc.querySelectorAll("td.nportal_opis"))
          .find((td) => td.textContent.replace(/[\s:]/g, "").toLowerCase() === label.replace(/[\s:]/g, "").toLowerCase());
        return labelEl
          ? labelEl.nextElementSibling?.textContent.trim() || ""
          : "";
      };

      // Dane główne
      const zgłaszający = getField("ZGŁASZAJACY");
      const status = getField("STATUS");
      const typ = getField("TYP");
      const adres = getField("ADRES");
      const tresc = getField("TREŚĆ");
      const komentarz = getField("KOMENTARZ");
      const dataZgl = getField("Data zgłoszenia");
      const dataRej = getField("Data rejestracji");
      const termin = getField("Data wymagana");

      // Numer zgłoszenia z tytułu lub z tekstu
      let numer = "";
      const numMatch = doc.body.textContent.match(/Zgłoszenie nr (OPC\d+)/i);
      if (numMatch) numer = numMatch[1];

      // Wyłap link do zgłoszenia
      let link = "";
      const linkEl = Array.from(doc.querySelectorAll("td.nportal_opis"))
        .find((td) => td.textContent.toLowerCase().includes("link"));
      if (linkEl) link = linkEl.nextElementSibling?.textContent.trim() || url;

      setDane({
        numer,
        typ,
        zgłaszający,
        status,
        dataZgl,
        dataRej,
        termin,
        adres,
        tresc,
        komentarz,
        link
      });
    } catch (err) {
      setError("Nie udało się pobrać lub przetworzyć zgłoszenia!");
    } finally {
      setLoading(false);
    }
  };

  // --------- DRUKOWANIE TYLKO KARTY ZGŁOSZENIA ---------
  const handlePrint = () => {
    if (!dane) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Protokół zgłoszenia</title>
          <style>
            body { font-family: Arial, sans-serif; background: #fff; color: #222; }
            .protokol-card {
              max-width: 550px; margin: 20px auto; border: 1.5px solid #7e9fb5; border-radius: 10px;
              box-shadow: 0 2px 16px #0001; padding: 32px 32px 24px 32px; background: #fafcff;
            }
            .protokol-card h2 { margin-top: 0; font-size: 1.3rem; letter-spacing: 1px; color: #124078; }
            .protokol-row { margin-bottom: 8px; }
            .label { font-weight: bold; width: 150px; display: inline-block; color: #29527A;}
            .value { color: #1a202c; }
            .adres { margin: 12px 0 0 0; font-weight: 600; color: #353e50; }
            .tresc { white-space: pre-wrap; color: #1a1a1a; margin-top: 6px; }
            .link { color: #1b5b98; text-decoration: underline; word-break: break-all; font-size: 0.96em;}
            @media print { body { background: #fff; } .protokol-card { box-shadow: none; margin: 0; } }
          </style>
        </head>
        <body>
          <div class="protokol-card">
            <h2>Zgłoszenie {dane.numer ? `nr ${dane.numer}` : ""}</h2>
            <div class="protokol-row"><span class="label">Typ:</span> <span class="value">${dane.typ}</span></div>
            <div class="protokol-row"><span class="label">Zgłaszający:</span> <span class="value">${dane.zgłaszający}</span></div>
            <div class="protokol-row"><span class="label">Status:</span> <span class="value">${dane.status}</span></div>
            <div class="protokol-row"><span class="label">Data zgłoszenia:</span> <span class="value">${dane.dataZgl}</span></div>
            <div class="protokol-row"><span class="label">Data rejestracji:</span> <span class="value">${dane.dataRej}</span></div>
            <div class="protokol-row"><span class="label">Termin realizacji:</span> <span class="value">${dane.termin}</span></div>
            <div class="adres">${dane.adres}</div>
            <div class="tresc">${dane.tresc}</div>
            ${dane.komentarz ? `<div class="protokol-row"><span class="label">Komentarz:</span> <span class="value">${dane.komentarz}</span></div>` : ""}
            <div class="protokol-row"><span class="label">Link:</span> <a href="${dane.link}" class="link">${dane.link}</a></div>
          </div>
          <script>window.print(); window.onafterprint = () => window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --------------- UI ---------------
  return (
    <div className="max-w-xl mx-auto py-12 px-3">
      <div className="glass-card-light p-8 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 text-slate-200 flex gap-2 items-center">
          📝 Generator protokołu zgłoszenia
        </h1>
        <form className="flex flex-col md:flex-row gap-4 items-end mb-6" onSubmit={fetchAndParse}>
          <div className="flex-1 w-full">
            <label className="text-slate-300 text-sm mb-1 block">
              Wklej link do zgłoszenia SPIE:
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://portal.spie.fm/zgloszenia_link.php?opc=..."
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Pobieram..." : "Generuj"}
          </button>
        </form>

        {error && <div className="text-red-400 mb-3">{error}</div>}

        {dane && (
          <div className="protokol-card my-6 mx-auto bg-slate-100 rounded-xl shadow border border-blue-200 px-7 py-6 text-slate-800 print:shadow-none print:rounded-none print:border-none print:bg-white">
            <h2 className="text-lg font-bold mb-2 text-blue-900">
              Zgłoszenie {dane.numer ? `nr ${dane.numer}` : ""}
            </h2>
            <div className="mb-1"><span className="font-semibold">Typ:</span> {dane.typ}</div>
            <div className="mb-1"><span className="font-semibold">Zgłaszający:</span> {dane.zgłaszający}</div>
            <div className="mb-1"><span className="font-semibold">Status:</span> {dane.status}</div>
            <div className="mb-1"><span className="font-semibold">Data zgłoszenia:</span> {dane.dataZgl}</div>
            <div className="mb-1"><span className="font-semibold">Data rejestracji:</span> {dane.dataRej}</div>
            <div className="mb-1"><span className="font-semibold">Termin realizacji:</span> {dane.termin}</div>
            <div className="mb-1"><span className="font-semibold">Adres:</span> <span className="font-medium">{dane.adres}</span></div>
            <div className="mb-2"><span className="font-semibold">Treść:</span> <span className="whitespace-pre-line">{dane.tresc}</span></div>
            {dane.komentarz && (
              <div className="mb-2"><span className="font-semibold">Komentarz:</span> {dane.komentarz}</div>
            )}
            <div className="mb-1">
              <span className="font-semibold">Link:</span>{" "}
              <a href={dane.link} target="_blank" rel="noopener noreferrer" style={{ color: "#135189", textDecoration: "underline" }}>
                {dane.link}
              </a>
            </div>
            <button
              onClick={handlePrint}
              className="mt-6 w-full py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-800 transition print:hidden"
            >
              Drukuj protokół
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
