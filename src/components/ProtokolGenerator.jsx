import React, { useState } from "react";

export default function ProtokolGenerator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dane, setDane] = useState(null);
  const [error, setError] = useState(null);

  // <<<< TWÓJ ADRES BACKENDU >>>>
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  // przykład dla produkcji: "https://tmobackend-xxx.onrender.com"

  const fetchAndParse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDane(null);

    try {
      // PROXY przez backend! (NIE fetch(url) bo to nie zadziała na SPIE)
      const api = `${BACKEND_URL}/api/protokol?url=${encodeURIComponent(url)}`;
      const res = await fetch(api);
      if (!res.ok) throw new Error("Nie udało się pobrać zgłoszenia!");
      const html = await res.text();

      const doc = new window.DOMParser().parseFromString(html, "text/html");

      const getField = (label) => {
        const labelEl = Array.from(doc.querySelectorAll("td.nportal_opis"))
          .find((td) =>
            td.textContent.replace(/[\s:]/g, "").toLowerCase() ===
            label.replace(/[\s:]/g, "").toLowerCase()
          );
        return labelEl
          ? labelEl.nextElementSibling?.textContent.trim() || ""
          : "";
      };

      // Dane z tabeli
      const zgłaszający = getField("ZGŁASZAJACY");
      const status = getField("STATUS");
      const typ = getField("TYP");
      const adres = getField("ADRES");
      const tresc = getField("TREŚĆ");
      const komentarz = getField("KOMENTARZ");
      const dataZgl = getField("Data zgłoszenia");
      const dataRej = getField("Data rejestracji");
      const termin = getField("Data wymagana");

      let numer = "";
      const numMatch = doc.body.textContent.match(/OPC\d{6,}/i);
      if (numMatch) numer = numMatch[0];

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
        link,
      });
    } catch (err) {
      setError("Nie udało się pobrać lub przetworzyć zgłoszenia!");
    } finally {
      setLoading(false);
    }
  };

  // Drukowanie jednej strony z kartą zgłoszenia
  const handlePrint = () => {
    if (!dane) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Zgłoszenie Remedy ${dane.numer ? dane.numer : ""}</title>
          <style>
            @media print {
              html, body { height: 99%; margin: 0; padding: 0; }
              .protokol-print { box-shadow: none !important; border: 1.2px solid #1972a2; margin: 0 !important; }
              .drukuj-btn { display: none !important; }
              body { background: #fff !important; }
            }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f9fbfc; color: #222; }
            .protokol-print {
              max-width: 690px;
              margin: 32px auto;
              padding: 32px 36px 24px 36px;
              background: #fff;
              border: 1.8px solid #1972a2;
              border-radius: 18px;
              box-shadow: 0 8px 24px #1961a319;
              min-height: 680px;
            }
            .naglowek {
              font-size: 1.6rem;
              color: #1972a2;
              margin-bottom: 4px;
              font-weight: 800;
              text-align: center;
              letter-spacing: 0.03em;
            }
            .numer {
              font-size: 1.1rem;
              text-align: center;
              color: #124078;
              font-weight: 500;
              margin-bottom: 16px;
              margin-top: 2px;
            }
            .row { display: flex; margin-bottom: 7px; }
            .label {
              width: 180px;
              min-width: 120px;
              color: #29527A;
              font-weight: 600;
              font-size: 1rem;
              letter-spacing: 0.02em;
            }
            .value { color: #152336; font-size: 1rem; flex: 1; }
            .adres { font-weight: 600; color: #2d3c4d; margin: 12px 0 6px 0; font-size: 1.05rem;}
            .tresc { margin: 5px 0 14px 0; color: #202020; font-size: 1.04rem; white-space: pre-line; }
            .link { color: #1753d1; text-decoration: underline; word-break: break-all; font-size: 0.99em;}
            .drukuj-btn {
              margin: 24px auto 0 auto;
              display: block;
              padding: 10px 38px;
              border-radius: 11px;
              background: #1972a2;
              color: #fff;
              font-weight: bold;
              font-size: 1.1rem;
              border: none;
              box-shadow: 0 1px 5px #1972a222;
              cursor: pointer;
              transition: background 0.22s;
            }
            .drukuj-btn:hover { background: #15517a;}
            .footer {
              font-size: 0.89em;
              text-align: right;
              color: #999;
              margin-top: 26px;
            }
          </style>
        </head>
        <body>
          <div class="protokol-print">
            <div class="naglowek">Zgłoszenie Remedy</div>
            ${dane.numer ? `<div class="numer">${dane.numer}</div>` : ""}
            <div class="row"><div class="label">Typ:</div><div class="value">${dane.typ}</div></div>
            <div class="row"><div class="label">Zgłaszający:</div><div class="value">${dane.zgłaszający}</div></div>
            <div class="row"><div class="label">Status:</div><div class="value">${dane.status}</div></div>
            <div class="row"><div class="label">Data zgłoszenia:</div><div class="value">${dane.dataZgl}</div></div>
            <div class="row"><div class="label">Data rejestracji:</div><div class="value">${dane.dataRej}</div></div>
            <div class="row"><div class="label">Termin realizacji:</div><div class="value">${dane.termin}</div></div>
            <div class="adres">Adres: ${dane.adres}</div>
            <div class="tresc">Treść: ${dane.tresc}</div>
            ${dane.komentarz ? `<div class="row"><div class="label">Komentarz:</div><div class="value">${dane.komentarz}</div></div>` : ""}
            <div class="row">
              <div class="label">Link:</div>
              <div class="value"><a href="${dane.link}" class="link" target="_blank">${dane.link}</a></div>
            </div>
            <div class="footer">
              Protokół wygenerowany ${new Date().toLocaleDateString("pl-PL")}
            </div>
          </div>
          <script>window.print(); window.onafterprint = () => window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-3">
      <div className="glass-card-light p-8 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 text-slate-200 flex gap-2 items-center">
          📝 Generator protokołu Remedy
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
          <div className="protokol-print my-6 mx-auto bg-white rounded-xl shadow border border-blue-200 px-7 py-6 text-slate-800 print:shadow-none print:rounded-none print:border-none print:bg-white">
            <div className="naglowek">Zgłoszenie Remedy</div>
            {dane.numer && <div className="numer">{dane.numer}</div>}
            <div className="row"><div className="label">Typ:</div><div className="value">{dane.typ}</div></div>
            <div className="row"><div className="label">Zgłaszający:</div><div className="value">{dane.zgłaszający}</div></div>
            <div className="row"><div className="label">Status:</div><div className="value">{dane.status}</div></div>
            <div className="row"><div className="label">Data zgłoszenia:</div><div className="value">{dane.dataZgl}</div></div>
            <div className="row"><div className="label">Data rejestracji:</div><div className="value">{dane.dataRej}</div></div>
            <div className="row"><div className="label">Termin realizacji:</div><div className="value">{dane.termin}</div></div>
            <div className="adres">Adres: {dane.adres}</div>
            <div className="tresc">Treść: {dane.tresc}</div>
            {dane.komentarz && (
              <div className="row"><div className="label">Komentarz:</div><div className="value">{dane.komentarz}</div></div>
            )}
            <div className="row">
              <div className="label">Link:</div>
              <div className="value">
                <a href={dane.link} target="_blank" rel="noopener noreferrer" className="link" style={{ color: "#1753d1" }}>
                  {dane.link}
                </a>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="drukuj-btn mt-6 w-full py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-800 transition print:hidden"
            >
              Drukuj protokół
            </button>
            <div className="footer">
              Protokół wygenerowany {new Date().toLocaleDateString("pl-PL")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
