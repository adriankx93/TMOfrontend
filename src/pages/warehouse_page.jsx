// AddWarehouseItemModal.tsx
import React, { useState } from "react";

export default function AddWarehouseItemModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "szt.",
    unitPrice: 0,
    supplier: "",
    priority: "Auto",
    notes: "",
    lowStockThreshold: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-white text-xl font-bold mb-4">Dodaj nowy materiał</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Nazwa materiału" className="p-2 rounded bg-gray-800 text-white" onChange={handleChange} required />
          <input name="category" placeholder="Kategoria" className="p-2 rounded bg-gray-800 text-white" onChange={handleChange} required />

          <input name="quantity" type="number" placeholder="Ilość" className="p-2 rounded bg-gray-800 text-white" onChange={handleChange} required />
          <input name="unit" placeholder="Jednostka" className="p-2 rounded bg-gray-800 text-white" onChange={handleChange} required />

          <input name="unitPrice" type="number" placeholder="Cena jednostkowa (PLN)" className="p-2 rounded bg-gray-800 text-white" onChange={handleChange} required />
          <input name="supplier" placeholder="Dostawca" className="p-2 rounded bg-gray-800 text-white" onChange={handleChange} />

          <select name="priority" className="p-2 rounded bg-gray-800 text-white" onChange={handleChange}>
            <option value="Auto">Auto (na podstawie ilości)</option>
            <option value="OK">OK</option>
            <option value="Niski stan">Niski stan</option>
            <option value="Krytyczne">Krytyczne</option>
            <option value="Brak">Brak</option>
          </select>

          <input name="lowStockThreshold" type="number" placeholder="Próg niski" className="p-2 rounded bg-gray-800 text-white" onChange={handleChange} />

          <textarea name="notes" placeholder="Dodatkowe informacje" className="col-span-2 p-2 rounded bg-gray-800 text-white" onChange={handleChange}></textarea>

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600">Anuluj</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Dodaj materiał</button>
          </div>
        </form>
      </div>
    </div>
  );
}
