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
    // Initialize with empty inventory
    setInventory([]);
  }, []);


  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'low': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'out_of_stock': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
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

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || 'gray';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.icon || '📦';
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
    <div className="space-y-8">
      <Topbar 
        title="Stan magazynowy" 
        subtitle="Zarządzaj zasobami i materiałami Miasteczka Orange"
        action={
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            + Dodaj pozycję
          </button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-slate-600 font-medium">Pozycji</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600">{stats.available}</div>
          <div className="text-slate-600 font-medium">Dostępne</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-amber-600">{stats.low}</div>
          <div className="text-slate-600 font-medium">Niski stan</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-slate-600 font-medium">Krytyczne</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-gray-600">{stats.outOfStock}</div>
          <div className="text-slate-600 font-medium">Brak</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalValue.toFixed(0)}</div>
          <div className="text-slate-600 font-medium">Wartość</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-4 flex-1">
            <span className="font-semibold text-slate-700">Kategoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl bg-white"
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
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl bg-white w-80"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => (
          <div 
            key={item.id}
            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 bg-${getCategoryColor(item.category)}-100 rounded-2xl flex items-center justify-center text-2xl`}>
                {getCategoryIcon(item.category)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{item.name}</h3>
                <div className="text-sm text-slate-600">{item.category}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`px-3 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(item.status)}`}>
                {getStatusLabel(item.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Stan</div>
                  <div className="font-bold text-lg">{item.quantity} {item.unit}</div>
                </div>
                <div>
                  <div className="text-slate-500">Min. stan</div>
                  <div className="font-semibold">{item.minQuantity} {item.unit}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Poziom zapasów</span>
                  <span className="font-semibold">{Math.round((item.quantity / item.minQuantity) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.quantity === 0 ? 'bg-gray-400' :
                      item.quantity < item.minQuantity * 0.5 ? 'bg-red-500' :
                      item.quantity < item.minQuantity ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (item.quantity / item.minQuantity) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Lokalizacja:</span>
                  <span className="font-semibold">{item.location}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-slate-500">Wartość:</span>
                  <span className="font-semibold text-green-600">{(item.quantity * item.cost).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Brak pozycji</h3>
          <p className="text-slate-500">Nie znaleziono pozycji spełniających kryteria wyszukiwania.</p>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-${getCategoryColor(selectedItem.category)}-100 rounded-2xl flex items-center justify-center text-3xl`}>
                    {getCategoryIcon(selectedItem.category)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedItem.name}</h2>
                    <p className="text-slate-600">{selectedItem.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <span className="text-2xl text-slate-400">×</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">Stan magazynowy</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{selectedItem.quantity} {selectedItem.unit}</div>
                    <div className="text-sm text-slate-600">Minimalny stan: {selectedItem.minQuantity} {selectedItem.unit}</div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">Lokalizacja</h3>
                    <div className="text-slate-700">{selectedItem.location}</div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">Dostawca</h3>
                    <div className="text-slate-700">{selectedItem.supplier}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">Status</h3>
                    <div className={`inline-block px-3 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(selectedItem.status)}`}>
                      {getStatusLabel(selectedItem.status)}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">Wartość</h3>
                    <div className="text-2xl font-bold text-green-600 mb-1">{selectedItem.cost.toFixed(2)}</div>
                    <div className="text-sm text-slate-600">za {selectedItem.unit}</div>
                    <div className="text-lg font-semibold text-slate-800 mt-2">
                      Łącznie: {(selectedItem.quantity * selectedItem.cost).toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">Ostatnia aktualizacja</h3>
                    <div className="text-slate-700">
                      {new Date(selectedItem.lastUpdated).toLocaleString('pl-PL')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 flex gap-4">
                <button className="flex-1 py-3 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 transition-all duration-200">
                  Edytuj pozycję
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}