import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import AddWarehouseItemModal from "../components/AddWarehouseItemModal";
import axios from "axios";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = [
    { name: "Elektronika", icon: "💻", color: "blue" },
    { name: "Narzędzia", icon: "🔧", color: "orange" },
    { name: "Materiały elektryczne", icon: "⚡", color: "yellow" },
    { name: "HVAC", icon: "🌡️", color: "green" },
    { name: "Bezpieczeństwo", icon: "🛡️", color: "red" },
    { name: "Sprzątanie", icon: "🧹", color: "purple" },
    { name: "Części zamienne", icon: "⚙️", color: "gray" }
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Warehouse/items`);
      const updatedItems = res.data.map(item => ({
        ...item,
        status: calculateStatus(item)
      }));
      setInventory(updatedItems);
    } catch (err) {
      console.error("Błąd podczas pobierania danych magazynowych:", err);
    }
  };

  const handleAddItem = async (item) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/Warehouse/items`, item);
      fetchInventory();
      setShowAddModal(false);
    } catch (err) {
      console.error("Błąd podczas dodawania pozycji:", err);
    }
  };

  const calculateStatus = (item) => {
    if (item.priority && item.priority !== "Auto") return item.priority;
    if (item.quantity <= 0) return "out_of_stock";
    if (item.quantity <= item.lowStockThreshold) return "low";
    if (item.quantity < item.lowStockThreshold / 2) return "critical";
    return "available";
  };

  const getInventoryStats = () => {
    const total = inventory.length;
    const available = inventory.filter(i => i.status === 'available').length;
    const low = inventory.filter(i => i.status === 'low').length;
    const critical = inventory.filter(i => i.status === 'critical').length;
    const outOfStock = inventory.filter(i => i.status === 'out_of_stock').length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

    return { total, available, low, critical, outOfStock, totalValue };
  };

  const stats = getInventoryStats();

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zarządzanie magazynem" 
        subtitle="Inwentarz, zasoby i kontrola stanów magazynowych"
        action={
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>📦</span>
            <span>Dodaj pozycję</span>
          </button>
        }
      />

      {showAddModal && (
        <AddWarehouseItemModal 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddItem} 
        />
      )}

      {/* tutaj można dodać dalszy kod renderowania */}
    </div>
  );
}
