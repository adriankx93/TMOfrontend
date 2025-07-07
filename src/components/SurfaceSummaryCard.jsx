import React from "react";

export default function SurfaceSummaryCard() {
  return (
    <div className="bg-slate-900 rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-3">
        Ogólne zestawienie powierzchni i kubatur
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
        <div>
          <dl>
            <dt className="font-semibold text-white">Powierzchnia działki</dt>
            <dd className="mb-2">24 710,0 m²</dd>

            <dt className="font-semibold text-white">Powierzchnia zabudowy</dt>
            <dd className="mb-2">11 046,5 m²</dd>

            <dt className="font-semibold text-white">Powierzchnia całkowita</dt>
            <dd>
              81 616,0 m² <br />
              <span className="text-xs ml-2">- nadziemna: 49 463,9 m²</span>
              <br />
              <span className="text-xs ml-2">- podziemna: 32 152,1 m²</span>
            </dd>

            <dt className="font-semibold text-white mt-2">
              Powierzchnia użytkowa netto
            </dt>
            <dd>
              71 477,1 m² <br />
              <span className="text-xs ml-2">- nadziemna: 42 829,5 m²</span>
              <br />
              <span className="text-xs ml-2">- podziemna: 28 647,6 m²</span>
            </dd>

            <dt className="font-semibold text-white mt-2">
              Powierzchnia biurowa i usługowa
            </dt>
            <dd className="mb-2">35 084,7 m²</dd>
          </dl>
        </div>
        <div>
          <dl>
            <dt className="font-semibold text-white">Kubatura</dt>
            <dd className="mb-2">106 464 m³</dd>

            <dt className="font-semibold text-white">
              Miejsca parkingowe podziemne
            </dt>
            <dd className="mb-2">1 052</dd>

            <dt className="font-semibold text-white">Wskaźniki</dt>
            <dd>
              <span className="block">
                Intensywność zabudowy: <b>2,00</b>
              </span>
              <span className="block">
                Wskaźnik zabudowy do terenu: <b>0,447</b>
              </span>
              <span className="block">
                Miejsc parkingowych na 1000 m² pow. biurowej/usługowej:{" "}
                <b>30,04</b>
              </span>
            </dd>

            <dt className="font-semibold text-white mt-2">
              Wysokości budynków
            </dt>
            <dd>
              <span className="block">
                Budynek frontowy: 6 kond., 23,15 m
              </span>
              <span className="block">
                Pawilony (4x): 6 kond., 23,15 m
              </span>
              <span className="block">
                Łączniki/skrz. boczne: 2 kond., 8,35 m
              </span>
            </dd>

            <dt className="font-semibold text-white mt-2">
              Wysokość brutto pomieszczeń
            </dt>
            <dd>
              <span className="block">
                Poziom -1 (garaże, tech.): 3,55 m
              </span>
              <span className="block">Poziom -2: 3,05 m</span>
              <span className="block">Parter: 4,30 m</span>
              <span className="block">+1 i +5: 3,85 m</span>
              <span className="block">+2, +3, +4: 3,65 m</span>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
