// warehouse_page.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddWarehouseItemModal from "../components/AddWarehouseItemModal";

export default function WarehousePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Warehouse/items`);
      setItems(res.data);
    } catch (err) {
      console.error("Błąd podczas pobierania pozycji magazynowych:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (item) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/Warehouse/items`, item);
      fetchItems();
      setShowModal(false);
    } catch (err) {
      console.error("Błąd podczas dodawania pozycji:", err);
    }
  };

  const getStatus = (item) => {
    if (item.priority && item.priority !== "Auto") return item.priority;
    if (item.quantity <= 0) return "Brak";
    if (item.quantity <= item.lowStockThreshold) return "Niski stan";
    return "OK";
  };

  const total = items.length;
  const available = items.filter(i => i.quantity > 0).length;
  const lowStock = items.filter(i => getStatus(i) === "Niski stan").length;
  const critical = items.filter(i => getStatus(i) === "Krytyczne").length;
  const missing = items.filter(i => getStatus(i) === "Brak").length;
  const totalValue = items.reduce((sum, i) => sum + (i.unitPrice || 0) * i.quantity, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Zarządzanie magazynem</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => setShowModal(true)}>
          Dodaj pozycję
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4 mt-6">
        <Card title="Pozycji" value={total} />
        <Card title="Dostępne" value={available} />
        <Card title="Niski stan" value={lowStock} warning />
        <Card title="Krytyczne" value={critical} danger />
        <Card title="Brak" value={missing} danger />
        <Card title="Wartość" value={`${totalValue.toFixed(2)} PLN`} />
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-gray-400">Ładowanie...</p>
        ) : items.length === 0 ? (
          <div className="text-center text-white mt-10">
            <p className="mb-2">Magazyn jest pusty</p>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Dodaj pozycję
            </button>
          </div>
        ) : (
          <table className="w-full mt-4 text-sm text-white">
            <thead>
              <tr>
                <th>Nazwa</th><th>Ilość</th><th>Status</th><th>Jednostka</th><th>Cena</th><th>Dostawca</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={getStatus(item) === "Brak" ? "bg-red-900" : getStatus(item) === "Niski stan" ? "bg-yellow-800" : "bg-gray-800"}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{getStatus(item)}</td>
                  <td>{item.unit}</td>
                  <td>{item.unitPrice} PLN</td>
                  <td>{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <AddWarehouseItemModal onClose={() => setShowModal(false)} onSubmit={handleAdd} />}
    </div>
  );
}

function Card({ title, value, warning = false, danger = false }) {
  const bg = danger ? "bg-red-800" : warning ? "bg-yellow-700" : "bg-gray-700";
  return (
    <div className={`rounded-xl p-4 text-center text-white ${bg}`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
