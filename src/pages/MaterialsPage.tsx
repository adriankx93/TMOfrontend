import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";

interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  requestDate: string;
  reason: string;
  estimatedCost: number;
  supplier: string;
  status: 'requested' | 'approved' | 'ordered' | 'delivered' | 'rejected';
  notes: string;
  taskId?: string;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    const sampleMaterials = [
      {
        id: "1",
        name: "Żarówki LED 15W",
        category: "Materiały elektryczne",
        quantity: 20,
        unit: "szt",
        urgency: 'high',
        requestedBy: "Jan Kowalski",
        requestDate: new Date().toISOString(),
        reason: "Awaria oświetlenia w hali A - brak zapasów",
        estimatedCost: 15.99,
        supplier: "ElektroMax Sp. z o.o.",
        status: 'requested',
        notes: "Pilne - hala bez oświetlenia",
        taskId: "TASK-001"
      },
      {
        id: "2",
        name: "Filtry HVAC G4",
        category: "HVAC",
        quantity: 8,
        unit: "szt",
        urgency: 'critical',
        requestedBy: "Anna Nowak",
        requestDate: new Date(Date.now() - 86400000).toISOString(),
        reason: "Wymiana filtrów - przekroczony czas eksploatacji",
        estimatedCost: 89.99,
        supplier: "AirTech Solutions",
        status: 'approved',
        notes: "Zamawiać co 3 miesiące",
        taskId: "TASK-002"
      },
      {
        id: "3",
        name: "Kable ethernet Cat6",
        category: "Elektronika",
        quantity: 50,
        unit: "m",
        urgency: 'medium',
        requestedBy: "Piotr Wiśniewski",
        requestDate: new Date(Date.now() - 172800000).toISOString(),
        reason: "Rozbudowa sieci w biurze administracyjnym",
        estimatedCost: 2.50,
        supplier: "TechnoNet",
        status: 'ordered',
        notes: "Dostawa planowana na przyszły tydzień"
      },
      {
        id: "4",
        name: "Śruby M8x25",
        category: "Narzędzia",
        quantity: 100,
        unit: "szt",
        urgency: 'low',
        requestedBy: "Marek Zieliński",
        requestDate: new Date(Date.now() - 259200000).toISOString(),
        reason: "Montaż nowych uchwytów na dachu",
        estimatedCost: 0.35,
        supplier: "MetalParts",
        status: 'delivered',
        notes: "Dostarczone - można przenieść do magazynu"
      },
      {
        id: "5",
        name: "Czujniki ruchu PIR",
        category: "Bezpieczeństwo",
        quantity: 6,
        unit: "szt",
        urgency: 'high',
        requestedBy: "Katarzyna Lewandowska",
        requestDate: new Date(Date.now() - 345600000).toISOString(),
        reason: "Awaria systemu alarmowego - wymiana czujników",
        estimatedCost: 45.00,
        supplier: "SecureTech",
        status: 'rejected',
        notes: "Odrzucone - za drogi dostawca, szukać alternatywy"
      }
    ];

    setMaterials(sampleMaterials);
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch(urgency) {
      case 'low': return 'Niski';
      case 'medium': return 'Średni';
      case 'high': return 'Wysoki';
      case 'critical': return 'Krytyczny';
      default: return 'Nieznany';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'requested': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'ordered': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'requested': return 'Zgłoszone';
      case 'approved': return 'Zatwierdzone';
      case 'ordered': return 'Zamówione';
      case 'delivered': return 'Dostarczone';
      case 'rejected': return 'Odrzucone';
      default: return 'Nieznany';
    }
  };

  const handleStatusChange = (materialId, newStatus) => {
    setMaterials(prev => prev.map(material => 
      material.id === materialId 
        ? { ...material, status: newStatus }
        : material
    ));
  };

  const handleMoveToInventory = (materialId) => {
    // In real app, this would move the material to inventory
    handleStatusChange(materialId, 'delivered');
    alert('Materiał przeniesiony do magazynu!');
  };

  const filteredMaterials = materials.filter(material => {
    const matchesStatus = selectedStatus === "all" || material.status === selectedStatus;
    const matchesUrgency = selectedUrgency === "all" || material.urgency === selectedUrgency;
    return matchesStatus && matchesUrgency;
  });

  const getStats = () => {
    const total = materials.length;
    const requested = materials.filter(m => m.status === 'requested').length;
    const approved = materials.filter(m => m.status === 'approved').length;
    const ordered = materials.filter(m => m.status === 'ordered').length;
    const delivered = materials.filter(m => m.status === 'delivered').length;
    const totalCost = materials.reduce((sum, m) => sum + (m.quantity * m.estimatedCost), 0);

    return { total, requested, approved, ordered, delivered, totalCost };
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      <Topbar 
        title="Zarządzanie materiałami" 
        subtitle="Zamówienia, dostawy i przenoszenie do magazynu"
        action={
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            + Nowe zamówienie
          </button>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-slate-600 font-medium">Łącznie</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.requested}</div>
          <div className="text-slate-600 font-medium">Zgłoszone</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-slate-600 font-medium">Zatwierdzone</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.ordered}</div>
          <div className="text-slate-600 font-medium">Zamówione</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600">{stats.delivered}</div>
          <div className="text-slate-600 font-medium">Dostarczone</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalCost.toFixed(0)} zł</div>
          <div className="text-slate-600 font-medium">Wartość</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">Wszystkie</option>
              <option value="requested">Zgłoszone</option>
              <option value="approved">Zatwierdzone</option>
              <option value="ordered">Zamówione</option>
              <option value="delivered">Dostarczone</option>
              <option value="rejected">Odrzucone</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">Pilność:</span>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">Wszystkie</option>
              <option value="critical">Krytyczne</option>
              <option value="high">Wysokie</option>
              <option value="medium">Średnie</option>
              <option value="low">Niskie</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-6">
        {filteredMaterials.map((material) => (
          <div 
            key={material.id}
            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-xl font-bold text-slate-800">{material.name}</h3>
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getUrgencyColor(material.urgency)}`}>
                    {getUrgencyLabel(material.urgency)}
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(material.status)}`}>
                    {getStatusLabel(material.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <div className="text-slate-500 mb-1">Szczegóły zamówienia</div>
                    <div className="space-y-1">
                      <div><strong>Kategoria:</strong> {material.category}</div>
                      <div><strong>Ilość:</strong> {material.quantity} {material.unit}</div>
                      <div><strong>Koszt jednostkowy:</strong> {material.estimatedCost.toFixed(2)} zł</div>
                      <div><strong>Koszt łączny:</strong> {(material.quantity * material.estimatedCost).toFixed(2)} zł</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-slate-500 mb-1">Informacje o zgłoszeniu</div>
                    <div className="space-y-1">
                      <div><strong>Zgłosił:</strong> {material.requestedBy}</div>
                      <div><strong>Data:</strong> {new Date(material.requestDate).toLocaleDateString('pl-PL')}</div>
                      <div><strong>Dostawca:</strong> {material.supplier}</div>
                      {material.taskId && <div><strong>Zadanie:</strong> {material.taskId}</div>}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-slate-500 mb-1">Powód zamówienia</div>
                    <div className="text-slate-700 mb-3">{material.reason}</div>
                    {material.notes && (
                      <>
                        <div className="text-slate-500 mb-1">Notatki</div>
                        <div className="text-slate-700">{material.notes}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-slate-200">
              {material.status === 'requested' && (
                <>
                  <button 
                    onClick={() => handleStatusChange(material.id, 'approved')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-xl hover:bg-green-200 transition-all duration-200 font-medium"
                  >
                    ✅ Zatwierdź
                  </button>
                  <button 
                    onClick={() => handleStatusChange(material.id, 'rejected')}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium"
                  >
                    ❌ Odrzuć
                  </button>
                </>
              )}
              
              {material.status === 'approved' && (
                <button 
                  onClick={() => handleStatusChange(material.id, 'ordered')}
                  className="px-4 py-2 bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 transition-all duration-200 font-medium"
                >
                  🛒 Zamów
                </button>
              )}
              
              {material.status === 'ordered' && (
                <button 
                  onClick={() => handleStatusChange(material.id, 'delivered')}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium"
                >
                  📦 Oznacz jako dostarczone
                </button>
              )}
              
              {material.status === 'delivered' && (
                <button 
                  onClick={() => handleMoveToInventory(material.id)}
                  className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl hover:bg-emerald-200 transition-all duration-200 font-medium"
                >
                  📋 Przenieś do magazynu
                </button>
              )}
              
              <button 
                onClick={() => setSelectedMaterial(material)}
                className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium"
              >
                👁️ Szczegóły
              </button>
              
              <button className="px-4 py-2 bg-orange-100 text-orange-800 rounded-xl hover:bg-orange-200 transition-all duration-200 font-medium">
                ✏️ Edytuj
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Brak materiałów</h3>
          <p className="text-slate-500">Nie znaleziono materiałów spełniających kryteria.</p>
        </div>
      )}
    </div>
  );
}