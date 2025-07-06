import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";

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
    setInventory([]);
  }, []);

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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
              {stats.total}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Pozycji</h3>
          <p className="text-slate-400 text-sm">Łącznie w magazynie</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
              {stats.available}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Dostępne</h3>
          <p className="text-slate-400 text-sm">Gotowe do użycia</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">
              {stats.low}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Niski stan</h3>
          <p className="text-slate-400 text-sm">Wymaga uzupełnienia</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
              {stats.critical}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Krytyczne</h3>
          <p className="text-slate-400 text-sm">Natychmiastowe działanie</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <div className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-bold">
              {stats.outOfStock}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Brak</h3>
          <p className="text-slate-400 text-sm">Poza magazynem</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
              {stats.totalValue.toFixed(0)}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Wartość</h3>
          <p className="text-slate-400 text-sm">PLN łącznie</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-4 flex-1">
            <span className="font-semibold text-slate-200">Kategoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">Wszystkie</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Szukaj pozycji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 pr-4 py-3 w-80"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
          </div>
        </div>
      </div>

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
    </div>
  );
}