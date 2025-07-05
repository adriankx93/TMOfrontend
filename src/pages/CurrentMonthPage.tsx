import React, { useState, useEffect } from 'react';
import { sheetsService } from '../services/sheetsService';
import { SheetData } from '../types/sheets';

interface DebugInfo {
  timestamp: string;
  searchedSheets: string[];
  selectedSheet: string;
  apiCalls: Array<{
    url: string;
    status: string;
    response?: any;
    error?: string;
  }>;
  processingSteps: string[];
}

export default function CurrentMonthPage() {
  const [data, setData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    timestamp: '',
    searchedSheets: [],
    selectedSheet: '',
    apiCalls: [],
    processingSteps: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startTime = new Date().toISOString();
      const steps: string[] = [];
      const apiCalls: Array<{ url: string; status: string; response?: any; error?: string }> = [];
      
      steps.push(`${new Date().toLocaleTimeString()} - Rozpoczęcie pobierania danych`);
      
      // Test connection first
      try {
        steps.push(`${new Date().toLocaleTimeString()} - Testowanie połączenia z Google Sheets`);
        const connectionTest = await sheetsService.testConnection();
        steps.push(`${new Date().toLocaleTimeString()} - Połączenie OK, znaleziono ${connectionTest.sheets.length} arkuszy`);
        
        setDebugInfo(prev => ({
          ...prev,
          timestamp: startTime,
          searchedSheets: connectionTest.sheets,
          processingSteps: [...steps]
        }));
      } catch (connError) {
        steps.push(`${new Date().toLocaleTimeString()} - BŁĄD połączenia: ${connError}`);
        throw connError;
      }

      // Get current month data
      steps.push(`${new Date().toLocaleTimeString()} - Pobieranie danych dla bieżącego miesiąca`);
      const monthData = await sheetsService.getCurrentMonthData();
      
      steps.push(`${new Date().toLocaleTimeString()} - Wybrano arkusz: ${monthData.sheetName}`);
      steps.push(`${new Date().toLocaleTimeString()} - Znaleziono ${monthData.technicians.length} techników`);
      steps.push(`${new Date().toLocaleTimeString()} - Znaleziono ${monthData.shifts.length} dni zmian`);
      
      setData(monthData);
      setDebugInfo(prev => ({
        ...prev,
        selectedSheet: monthData.sheetName,
        processingSteps: steps
      }));
      
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieznany błąd';
      setError(errorMessage);
      
      setDebugInfo(prev => ({
        ...prev,
        processingSteps: [...prev.processingSteps, `${new Date().toLocaleTimeString()} - BŁĄD: ${errorMessage}`]
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCurrentMonthName = () => {
    const months = [
      "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
      "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];
    return months[new Date().getMonth()];
  };

  const getExpectedSheetName = () => {
    const currentMonth = getCurrentMonthName().toLowerCase();
    const currentYear = new Date().getFullYear();
    return `${currentMonth} ${currentYear}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Grafik zmian - aktualny miesiąc
            </h1>
            <p className="text-blue-100 text-lg mt-1">
              Diagnostyka i debug odczytu danych z Google Sheets
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? '⏳ Ładowanie...' : '🔄 Odśwież dane'}
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-4 h-4 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <h3 className="font-bold text-slate-800">Status połączenia</h3>
          </div>
          <p className="text-slate-600">
            {loading ? 'Łączenie...' : error ? 'Błąd połączenia' : 'Połączono pomyślnie'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3">Oczekiwany arkusz</h3>
          <p className="text-slate-600 font-mono text-sm">
            {getExpectedSheetName()}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-3">Wybrany arkusz</h3>
          <p className="text-slate-600 font-mono text-sm">
            {debugInfo.selectedSheet || 'Brak danych'}
          </p>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">📋 Kroki przetwarzania</h2>
        <div className="bg-slate-50 rounded-2xl p-4 max-h-64 overflow-y-auto">
          {debugInfo.processingSteps.length === 0 ? (
            <p className="text-slate-500 italic">Brak kroków przetwarzania</p>
          ) : (
            <div className="space-y-2">
              {debugInfo.processingSteps.map((step, index) => (
                <div key={index} className={`text-sm font-mono p-2 rounded ${
                  step.includes('BŁĄD') ? 'bg-red-100 text-red-800' :
                  step.includes('OK') ? 'bg-green-100 text-green-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Sheets */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">📊 Dostępne arkusze</h2>
        {debugInfo.searchedSheets.length === 0 ? (
          <p className="text-slate-500 italic">Brak danych o arkuszach</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debugInfo.searchedSheets.map((sheet, index) => (
              <div key={index} className={`p-4 rounded-xl border-2 ${
                sheet === debugInfo.selectedSheet 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center gap-2">
                  {sheet === debugInfo.selectedSheet && (
                    <span className="text-green-600">✅</span>
                  )}
                  <span className="font-mono text-sm">{sheet}</span>
                </div>
                {sheet.toLowerCase().includes(getCurrentMonthName().toLowerCase()) && (
                  <span className="text-xs text-blue-600 mt-1 block">Pasuje do bieżącego miesiąca</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Summary */}
      {data && (
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">📈 Podsumowanie danych</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{data.technicians.length}</div>
              <div className="text-sm text-blue-800">Techników</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{data.shifts.length}</div>
              <div className="text-sm text-green-800">Dni zmian</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{data.month + 1}</div>
              <div className="text-sm text-purple-800">Miesiąc</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{data.year}</div>
              <div className="text-sm text-orange-800">Rok</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-red-800 mb-4">❌ Błąd</h2>
          <div className="bg-red-100 rounded-xl p-4">
            <pre className="text-red-800 text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        </div>
      )}

      {/* Raw Data Debug */}
      {data && (
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">🔍 Surowe dane debug</h2>
          
          {/* Technicians Data */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Dane techników (C7:E18)</h3>
            <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                {JSON.stringify(data.debugRawData.techniciansData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Dates Data */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Dane dat (J32:AN32)</h3>
            <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                {JSON.stringify(data.debugRawData.datesData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Shifts Data */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Dane zmian (J7:AN18)</h3>
            <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto max-h-96">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                {JSON.stringify(data.debugRawData.shiftsData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Processed Data */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Przetworzone dane</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-600 mb-2">Technicy:</h4>
                <div className="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                    {JSON.stringify(data.technicians, null, 2)}
                  </pre>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-600 mb-2">Pierwsze 3 zmiany:</h4>
                <div className="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                    {JSON.stringify(data.shifts.slice(0, 3), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Info */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">⚙️ Konfiguracja</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-700 mb-3">Zakresy danych:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Technicy:</span>
                <span className="font-mono bg-slate-100 px-2 py-1 rounded">C7:E18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Daty:</span>
                <span className="font-mono bg-slate-100 px-2 py-1 rounded">J32:AN32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Zmiany:</span>
                <span className="font-mono bg-slate-100 px-2 py-1 rounded">J7:AN18</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 mb-3">Kody zmian:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Pierwsza zmiana:</span>
                <span className="font-mono bg-purple-100 px-2 py-1 rounded">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Dzienna:</span>
                <span className="font-mono bg-yellow-100 px-2 py-1 rounded">d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nocna:</span>
                <span className="font-mono bg-blue-100 px-2 py-1 rounded">n</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Urlop:</span>
                <span className="font-mono bg-green-100 px-2 py-1 rounded">u</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">L4:</span>
                <span className="font-mono bg-red-100 px-2 py-1 rounded">l4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}