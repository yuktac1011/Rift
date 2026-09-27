import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('enforcement');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const tabs = ['observation', 'verification', 'enforcement', 'evidence'];

  const triggerThreat = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/enforcement/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: 'rogue-agent-99', severity_score: 0.95 })
      });
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setApiResponse("Error connecting to backend. Is it running on port 8080?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          RIFT
        </h1>
        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
          SYSTEM SECURE
        </div>
      </header>

      <main className="flex-1 flex p-8 gap-8 max-w-[1600px] w-full mx-auto">
        <aside className="w-64 flex flex-col gap-2 shrink-0 border-r border-slate-800 pr-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Command Center</p>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl capitalize transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab} Plane
            </button>
          ))}
        </aside>

        <section className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold capitalize text-white">{activeTab} Overview</h2>
            
            {activeTab === 'enforcement' && (
              <button 
                onClick={triggerThreat}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2"
              >
                {loading ? "Processing..." : "🚨 Simulate Rogue Agent Threat"}
              </button>
            )}
          </div>

          <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
            {activeTab === 'enforcement' ? (
              <div className="flex flex-col gap-4">
                <p className="text-slate-400">Click the button above to simulate a malicious agent event. The frontend will send a request to the FastAPI backend, which will evaluate the severity and return a signed cryptographic decision record.</p>
                
                {apiResponse && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Backend Response / Decision Record</h3>
                    <pre className="text-emerald-400 text-sm">{apiResponse}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-2">Grafana Dashboard Placeholder</h3>
                <p>Connect OpenTelemetry to visualize {activeTab} metrics here.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
