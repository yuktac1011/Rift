import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Shield, ShieldAlert, Cpu, 
  Search, Lock, FileText, Settings, 
  Bell, ChevronDown, CheckCircle2, AlertTriangle, 
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';

// --- MOCK DATA ---
const riskData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  score: Math.floor(Math.random() * 30) + (i > 15 && i < 20 ? 40 : 10),
}));

const recentRifts = [
  { id: 'R-842', agent: 'data-analyzer-04', severity: 'danger', type: 'Exfiltration Attempt', time: '2m ago' },
  { id: 'R-841', agent: 'web-scraper-12', severity: 'warning', type: 'Rate Limit Violation', time: '15m ago' },
  { id: 'R-840', agent: 'db-sync-prod', severity: 'danger', type: 'Unauthorized Mutation', time: '1h ago' },
];

const agents = [
  { id: 'ag-01', name: 'data-analyzer-04', status: 'quarantined', health: 45 },
  { id: 'ag-02', name: 'web-scraper-12', status: 'active', health: 92 },
  { id: 'ag-03', name: 'db-sync-prod', status: 'halted', health: 0 },
  { id: 'ag-04', name: 'report-gen-01', status: 'active', health: 98 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('command_center');

  const navItems = [
    { id: 'command_center', icon: Activity, label: 'Command Center' },
    { id: 'agents', icon: Cpu, label: 'Agents' },
    { id: 'rifts', icon: ShieldAlert, label: 'Rifts' },
    { id: 'policies', icon: Lock, label: 'Policies' },
    { id: 'evidence', icon: FileText, label: 'Evidence & Audit' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-rift-bg text-rift-text-primary font-sans selection:bg-rift-accent/30 selection:text-rift-accent">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-rift-border bg-rift-surface/50 backdrop-blur-xl flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-rift-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rift-accent/10 flex items-center justify-center border border-rift-accent/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <Shield className="w-5 h-5 text-rift-accent" />
            </div>
            <span className="font-bold text-lg tracking-wide text-rift-text-primary">RIFT</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  isActive ? 'text-rift-text-primary' : 'text-rift-text-secondary hover:text-rift-text-primary hover:bg-rift-elevated/50'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-rift-elevated rounded-lg border border-rift-border shadow-sm -z-10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-rift-accent' : 'text-rift-text-secondary group-hover:text-rift-text-primary'}`} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-rift-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-rift-elevated border border-rift-border overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin&background=1E293B&color=94A3B8" alt="User" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-rift-text-secondary">admin@rift.security</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="h-16 border-b border-rift-border bg-rift-bg/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rift-text-secondary" />
              <input 
                type="text" 
                placeholder="Search agents, incidents, or hashes..." 
                className="w-full bg-rift-surface border border-rift-border text-sm rounded-md py-1.5 pl-9 pr-4 focus:outline-none focus:border-rift-accent/50 focus:ring-1 focus:ring-rift-accent/50 transition-all text-rift-text-primary placeholder-rift-text-secondary"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-rift-success/10 border border-rift-success/20 text-rift-success">
              <div className="w-1.5 h-1.5 rounded-full bg-rift-success animate-pulse"></div>
              Enforcement Active
            </div>
            <button className="relative text-rift-text-secondary hover:text-rift-text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rift-danger rounded-full border border-rift-bg"></span>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-rift-text-primary">Command Center</h2>
                <p className="text-sm text-rift-text-secondary mt-1">Real-time integrity overview of your multi-agent network.</p>
              </div>
              <button className="px-4 py-2 bg-rift-accent/10 hover:bg-rift-accent/20 text-rift-accent border border-rift-accent/30 rounded-md text-sm font-medium transition-colors cursor-pointer">
                Generate Report
              </button>
            </header>

            {/* METRICS ROW */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Active Agents', value: '142', icon: Cpu, trend: '+12%', color: 'text-rift-success', bg: 'bg-rift-success/10', border: 'border-rift-success/20' },
                { label: 'Network Health', value: '98.2%', icon: ShieldCheck, trend: 'Stable', color: 'text-rift-accent', bg: 'bg-rift-accent/10', border: 'border-rift-accent/20' },
                { label: 'Rifts Detected', value: '14', icon: AlertTriangle, trend: '+2 today', color: 'text-rift-warning', bg: 'bg-rift-warning/10', border: 'border-rift-warning/20' },
                { label: 'Hard Halts', value: '3', icon: ShieldAlert, trend: 'Past 24h', color: 'text-rift-danger', bg: 'bg-rift-danger/10', border: 'border-rift-danger/20' },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${stat.bg} ${stat.border}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <span className="text-xs font-medium text-rift-text-secondary">{stat.trend}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-rift-text-primary">{stat.value}</h3>
                    <p className="text-sm text-rift-text-secondary mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CHART & ALERTS ROW */}
            <div className="grid grid-cols-3 gap-6">
              
              {/* CHART */}
              <div className="col-span-2 glass-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-semibold text-rift-text-primary">System Risk Trend</h3>
                  <select className="bg-rift-bg border border-rift-border text-xs text-rift-text-secondary rounded px-2 py-1 outline-none">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                  </select>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={riskData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FB7185" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FB7185" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#FB7185' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#FB7185" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* RECENT RIFTS */}
              <div className="glass-card rounded-xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-semibold text-rift-text-primary">Recent Rifts</h3>
                  <button className="text-xs text-rift-accent hover:underline">View All</button>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  {recentRifts.map(rift => (
                    <div key={rift.id} className="flex gap-4 p-3 rounded-lg bg-rift-surface border border-rift-border hover:border-[#475569] transition-colors cursor-pointer group">
                      <div className={`w-1.5 rounded-full ${rift.severity === 'danger' ? 'bg-rift-danger' : 'bg-rift-warning'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-mono text-rift-text-secondary">{rift.id}</span>
                          <span className="text-xs text-rift-text-secondary">{rift.time}</span>
                        </div>
                        <p className="text-sm font-medium text-rift-text-primary truncate">{rift.type}</p>
                        <p className="text-xs text-rift-text-secondary truncate mt-0.5">{rift.agent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AGENTS TABLE */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-rift-border flex justify-between items-center bg-rift-surface/80">
                <h3 className="text-sm font-semibold text-rift-text-primary">Agent Integrity Matrix</h3>
                <button className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-rift-elevated border border-rift-border rounded-md hover:bg-[#334155] transition-colors text-rift-text-primary cursor-pointer">
                  Filter
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-rift-bg text-rift-text-secondary text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Agent ID</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Health Score</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rift-border">
                    {agents.map(agent => (
                      <tr key={agent.id} className="hover:bg-rift-elevated/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-rift-text-secondary text-xs">{agent.id}</td>
                        <td className="px-6 py-4 text-rift-text-primary font-medium">{agent.name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium uppercase border ${
                            agent.status === 'active' ? 'bg-rift-success/10 text-rift-success border-rift-success/20' :
                            agent.status === 'quarantined' ? 'bg-rift-warning/10 text-rift-warning border-rift-warning/20' :
                            'bg-rift-danger/10 text-rift-danger border-rift-danger/20'
                          }`}>
                            {agent.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                            {agent.status === 'quarantined' && <AlertTriangle className="w-3 h-3" />}
                            {agent.status === 'halted' && <ShieldAlert className="w-3 h-3" />}
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 bg-rift-elevated rounded-full overflow-hidden border border-rift-border">
                              <div 
                                className={`h-full ${agent.health > 80 ? 'bg-rift-success' : agent.health > 40 ? 'bg-rift-warning' : 'bg-rift-danger'}`}
                                style={{ width: `${agent.health}%` }}
                              ></div>
                            </div>
                            <span className="font-mono text-xs text-rift-text-secondary">{agent.health}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs text-rift-accent hover:text-white transition-colors cursor-pointer">Inspect</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
