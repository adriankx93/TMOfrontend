import Topbar from "../components/Topbar";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Ustawienia systemu" 
        subtitle="Konfiguracja, integracje i administracja systemu CAFM"
        action={
          <button className="btn-primary flex items-center gap-2">
            <span>💾</span>
            <span>Zapisz konfigurację</span>
          </button>
        }
      />

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔧</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Ogólne</h3>
          <p className="text-slate-400 text-sm">Podstawowe ustawienia systemu</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔗</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Integracje</h3>
          <p className="text-slate-400 text-sm">API i połączenia zewnętrzne</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Użytkownicy</h3>
          <p className="text-slate-400 text-sm">Zarządzanie dostępem</p>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Konfiguracja systemu</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Nazwa organizacji
              </label>
              <input
                type="text"
                value="Miasteczko Orange"
                className="input-field w-full"
                placeholder="Wprowadź nazwę organizacji"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Strefa czasowa
              </label>
              <select className="input-field w-full">
                <option>Europe/Warsaw (UTC+1)</option>
                <option>Europe/London (UTC+0)</option>
                <option>America/New_York (UTC-5)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Język systemu
              </label>
              <select className="input-field w-full">
                <option>Polski</option>
                <option>English</option>
                <option>Deutsch</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Automatyczne powiadomienia
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded" defaultChecked />
                  <span className="text-slate-300">Email o nowych zadaniach</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded" defaultChecked />
                  <span className="text-slate-300">SMS o awariach krytycznych</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded" />
                  <span className="text-slate-300">Raporty tygodniowe</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Częstotliwość kopii zapasowych
              </label>
              <select className="input-field w-full">
                <option>Codziennie</option>
                <option>Co tydzień</option>
                <option>Co miesiąc</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-8 border-t border-slate-700 mt-8">
          <button className="btn-primary">
            Zapisz ustawienia
          </button>
          <button className="btn-secondary">
            Przywróć domyślne
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Status systemu</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-light p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="status-indicator bg-green-400"></div>
              <span className="font-semibold text-green-400">Baza danych</span>
            </div>
            <p className="text-slate-400 text-sm">Połączenie aktywne</p>
          </div>

          <div className="glass-card-light p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="status-indicator bg-green-400"></div>
              <span className="font-semibold text-green-400">Google Sheets API</span>
            </div>
            <p className="text-slate-400 text-sm">Synchronizacja aktywna</p>
          </div>

          <div className="glass-card-light p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="status-indicator bg-amber-400"></div>
              <span className="font-semibold text-amber-400">Powiadomienia</span>
            </div>
            <p className="text-slate-400 text-sm">Częściowo aktywne</p>
          </div>
        </div>
      </div>
    </div>
  );
}