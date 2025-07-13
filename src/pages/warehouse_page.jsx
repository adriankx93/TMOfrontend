// WarehousePage.tsx
import React, { useState, useEffect } from "react";
import AddWarehouseItemModal from "../components/AddWarehouseItemModal";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function WarehousePage() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get("/api/Warehouse/items");
    setItems(res.data);
  };

  const handleAdd = async (item) => {
    await axios.post("/api/Warehouse/items", item);
    fetchItems();
    setShowModal(false);
  };

  const total = items.length;
  const available = items.filter(i => i.quantity > 0).length;
  const lowStock = items.filter(i => i.quantity > 0 && i.quantity <= i.lowStockThreshold).length;
  const critical = items.filter(i => i.priority === "Krytyczne").length;
  const missing = items.filter(i => i.quantity <= 0).length;
  const totalValue = items.reduce((sum, i) => sum + (i.unitPrice || 0) * i.quantity, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Zarządzanie magazynem</h1>
        <Button onClick={() => setShowModal(true)}>Dodaj pozycję</Button>
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
        {items.length === 0 ? (
          <p className="text-gray-400">Magazyn jest pusty.</p>
        ) : (
          <table className="w-full mt-4 text-sm text-white">
            <thead>
              <tr>
                <th>Nazwa</th><th>Ilość</th><th>Status</th><th>Jednostka</th><th>Cena</th><th>Dostawca</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={item.quantity <= 0 ? "bg-red-900" : item.quantity <= item.lowStockThreshold ? "bg-yellow-800" : "bg-gray-800"}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.priority || "Auto"}</td>
                  <td>{item.unit}</td>
                  <td>{item.unitPrice} PLN</td>
                  <td>{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <AddWarehouseItemModal onClose={() => setShowModal(false)} onSubmit={handleAdd} />
      )}
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
