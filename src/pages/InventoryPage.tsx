import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import AddWarehouseItemModal from "../components/AddWarehouseItemModal";
import axios from "axios";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  location: string;
  lastUpdated: string;
  supplier: string;
  cost: number;
  status: 'available' | 'low' | 'critical' | 'out_of_stock';
}

interface InventoryCategory {
  name: string;
  icon: string;
  color: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const categories: InventoryCategory[] = [
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
      setInventory(res.data);
    } catch (err) {
      console.error("Błąd podczas pobierania danych magazynowych:", err);
    }
  };

  const handleAddItem = async (item: any) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/Warehouse/items`, item);
      fetchInventory();
      setShowAddModal(false);
    } catch (err) {
      console.error("Błąd podczas dodawania pozycji:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'low': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'out_of_stock': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'available': return 'Dostępny';
      case 'low': return 'Niski stan';
      case 'critical': return 'Krytyczny';
      case 'out_of_stock': return 'Brak na stanie';
      default: return 'Nieznany';
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      {/* Statistics Cards */}
      {/* ... (pozostała część kart statystyk bez zmian) */}

      {/* Filters and Search */}
      {/* ... (pozostałe filtry i wyszukiwanie) */}

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <div className="glass-card p-12 text-center animate-slide-in-up">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Magazyn jest pusty</h3>
          <p className="text-slate-500 mb-6">Dodaj pierwszą pozycję do systemu inwentaryzacji.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Dodaj pozycję
          </button>
        </div>
      )}

      {showAddModal && (
        <AddWarehouseItemModal 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddItem} 
        />
      )}
    </div>
  );
}
