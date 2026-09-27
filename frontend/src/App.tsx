import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Activity, Database, ArrowRight, Zap, Target, 
  Search, ShieldAlert, Cpu, CheckCircle2, 
  AlertTriangle, ShieldCheck, FileCode, Play, 
  Server, Network, X, MessageSquareWarning 
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, ReferenceLine } from 'recharts';
import * as THREE from 'three';

// ==========================================
// MOCK DATA GENERATION
// ==========================================
const generateRiftScoreData = () => Array.from({ length: 24 }).map((_, i) => ({
  time: `T-${24-i}m`,
  score: Math.max(10, Math.floor(Math.random() * 25) + 10), // Base score (healthy)
}));

const initialAgents = [
  { id: 'ag-prod-data-01', name: 'finance-parser', status: 'active', health: 98, uptime: '14d 2h', framework: 'LangChain', ip: '10.0.4.12', memory: '1.2GB', tasks: 412 },
  { id: 'ag-prod-data-02', name: 'market-scraper', status: 'active', health: 95, uptime: '14d 1h', framework: 'CrewAI', ip: '10.0.4.15', memory: '2.4GB', tasks: 843 },
  { id: 'ag-sec-audit-01', name: 'compliance-checker', status: 'active', health: 100, uptime: '30d', framework: 'Custom Go', ip: '10.0.1.5', memory: '450MB', tasks: 12 },
];

const initialRifts = [
  { id: 'R-842', agent: 'db-sync-service', severity: 'High', type: 'Semantic Deviation', time: '2m ago', enforcement: 'Quarantined', resource: 's3://prod-customer-data' }
];

const initialContracts = [
  { id: 'CTR-01', name: 'Restrict Database Writes', target: 'All Agents', enabled: true, code: 'deny { input.action == "write" }' },
  { id: 'CTR-02', name: 'Strict Semantic Bounds', target: 'Scraper Fleet', enabled: true, code: 'deny { input.rift_score > 60 }' },
];

const initialEvidence = [
  { hash: 'e3b0c44298fc1c149afbf4c8996fb924', prev: '00000000000000000000000000000000', event: 'HARD_HALT agent qa-automator', time: new Date(Date.now() - 1000000).toLocaleTimeString(), attest: 'SPIFFE/jwt-82f', riftScore: 94 }
];

// ==========================================
// 3D COMPONENT
// ==========================================
function RiftCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial color="#C2410C" emissive="#FB923C" emissiveIntensity={0.8} wireframe={true} distort={0.4} speed={2} />
      </mesh>
      <mesh scale={1.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#0C0A09" emissive="#C2410C" emissiveIntensity={0.1} roughness={0.2} metalness={0.8} />
      </mesh>
      <Sparkles count={150} scale={5} size={2} speed={0.4} color="#FB923C" />
    </Float>
  );
}

// ==========================================
// TOAST NOTIFICATION COMPONENT
// ==========================================
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'warning', onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} 
      className={`fixed bottom-10 left-1/2 z-[100] px-6 py-4 rounded-xl border font-bold flex items-center gap-4 shadow-2xl backdrop-blur-md 
        ${type === 'error' ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444]' : 
          type === 'warning' ? 'bg-[#eab308]/20 border-[#eab308] text-[#eab308]' :
          'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'}`}>
      {type === 'error' ? <AlertTriangle className="w-6 h-6 animate-pulse"/> : type === 'warning' ? <ShieldAlert className="w-6 h-6"/> : <CheckCircle2 className="w-6 h-6"/>}
      <span className="text-lg">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100"><X className="w-4 h-4"/></button>
    </motion.div>
  );
}

// ==========================================
// LANDING PAGE
// ==========================================
function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="min-h-screen bg-rift-bg text-rift-text-primary selection:bg-rift-primary/30 selection:text-rift-primary-light font-sans">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-rift-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Shield className="w-6 h-6 text-rift-primary" />
            <span className="font-bold text-xl tracking-tight">RIFT</span>
          </div>
          <button onClick={onLaunch} className="px-5 py-2 bg-rift-surface border border-rift-border hover:border-rift-primary transition-colors rounded-full text-sm font-medium cursor-pointer flex items-center gap-2">
            Launch Demo <Play className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rift-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rift-primary/10 border border-rift-primary/20 text-rift-primary-light text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3 h-3" /> Runtime Integrity for AI
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-rift-text-primary">
              Detect the Rift before it <span className="text-transparent bg-clip-text bg-gradient-to-r from-rift-primary to-rift-primary-light glow-text">breaks everything.</span>
            </h1>
            <p className="text-lg md:text-xl text-rift-text-secondary max-w-lg leading-relaxed">
              Agentic networks drift. They hallucinate, mutate, and act unpredictably. Rift enforces strict <strong>Behavioral Contracts</strong> and guarantees <strong>Cryptographic Integrity</strong> in real-time.
            </p>
            <button onClick={onLaunch} className="px-8 py-4 bg-rift-primary hover:bg-rift-primary-light text-[#FAFAF9] rounded-full font-bold transition-all shadow-[0_0_20px_rgba(194,65,12,0.3)] flex items-center justify-center gap-2 cursor-pointer w-fit">
              Launch Live Interactive Demo <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
          <div className="h-[600px] w-full relative">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#FB923C" />
              <RiftCore />
              <Environment preset="city" />
            </Canvas>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-32 bg-rift-bg border-t border-rift-border text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(194,65,12,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl font-bold mb-6">Close the Rift.</h2>
          <p className="text-xl text-rift-text-secondary mb-10">
            Stop hoping your autonomous agents behave. Start cryptographically enforcing it.
          </p>
          <button onClick={onLaunch} className="px-10 py-5 bg-rift-primary hover:bg-rift-primary-light text-[#FAFAF9] rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(194,65,12,0.4)] cursor-pointer flex items-center justify-center gap-3 mx-auto">
            Test the Dashboard <Play className="w-5 h-5 fill-current"/>
          </button>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// DASHBOARD APP (HIGHLY INTERACTIVE)
// ==========================================
function Dashboard({ onExit }: { onExit: () => void }) {
  const [activeTab, setActiveTab] = useState('command_center');
  const [agents, setAgents] = useState(initialAgents);
  const [rifts, setRifts] = useState(initialRifts);
  const [evidenceLog, setEvidenceLog] = useState(initialEvidence);
  const [contracts, setContracts] = useState(initialContracts);
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'warning'}|null>(null);

  // Live Chart Updates
  const [riskData, setRiskData] = useState(generateRiftScoreData);
  useEffect(() => {
    if (isSimulating) return; // Freeze chart during attack
    const interval = setInterval(() => {
      setRiskData(prev => {
        const newData = [...prev.slice(1)];
        const lastScore = prev[prev.length - 1].score;
        let newScore = lastScore + (Math.random() * 10 - 5);
        newScore = Math.max(10, Math.min(newScore, 40)); // Keep baseline healthy
        newData.push({ time: new Date().toLocaleTimeString().substring(0, 5), score: newScore });
        return newData;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const triggerGraduatedEnforcement = async () => {
    setIsSimulating(true);
    setToast(null);

    // 1. Spiking the Rift Score
    setRiskData(prev => [...prev.slice(1), { time: 'NOW', score: 99 }]);
    
    // 2. Mocking Graduated Enforcement Flow
    setTimeout(() => setToast({ msg: "[Phase 1] Rift Score > 60: Agent Flagged.", type: 'warning' }), 500);
    setTimeout(() => setToast({ msg: "[Phase 2] Semantic bounds breached: Attempting Soft Halt & Re-plan.", type: 'warning' }), 2000);
    
    setTimeout(() => {
      const rogueId = `ag-rogue-${Date.now()}`;
      setAgents(prev => [{ id: rogueId, name: 'rogue-injector', status: 'hard-halted', health: 0, uptime: '0s', framework: 'Unknown', ip: '10.9.9.9', memory: 'Max', tasks: 1 }, ...prev]);
      setRifts(prev => [{ id: `R-${Math.floor(Math.random()*1000)}`, agent: 'rogue-injector', severity: 'Critical', type: 'Contract Breach', time: 'Just now', enforcement: 'Hard Halt', resource: 'users_db' }, ...prev]);
      setEvidenceLog(prev => [{ hash: '9b71d224bd62f3785d96d46ad3ea3d73', prev: prev[0]?.hash, event: `HARD_HALT agent`, time: new Date().toLocaleTimeString(), attest: 'SPIFFE/jwt', riftScore: 99 }, ...prev]);
      
      setToast({ msg: "CRITICAL [Phase 3]: Agent ignored Soft Halt. HARD HALT enforced & Cryptographic Proof generated!", type: 'error' });
      setIsSimulating(false);
      
      // Auto-switch to Rifts tab to show the judges the consequence
      setTimeout(() => setActiveTab('rifts'), 3000);
    }, 4500);
  };

  // Agent Deployment Simulation
  const [deploying, setDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  
  const handleDeployAgent = () => {
    setDeploying(true);
    setDeployLogs(["[INFO] Initializing Rift Sidecar..."]);
    setTimeout(() => setDeployLogs(p => [...p, "[INFO] Fetching SPIFFE credentials..."]), 800);
    setTimeout(() => setDeployLogs(p => [...p, "[INFO] Establishing mTLS with Control Plane..."]), 1600);
    setTimeout(() => setDeployLogs(p => [...p, "[SUCCESS] Behavioral Contracts loaded. Sidecar attached."]), 2400);
    setTimeout(() => {
      setAgents(prev => [{ id: `ag-new-${Math.floor(Math.random()*1000)}`, name: 'customer-support-bot', status: 'active', health: 100, uptime: '0s', framework: 'AutoGPT', ip: `10.0.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`, memory: '210MB', tasks: 0 }, ...prev]);
      setDeploying(false);
      setToast({ msg: "New Agent secured with Rift Sidecar!", type: 'success' });
    }, 3200);
  };

  // Active Challenge Protocol Simulation
  const [challengeAgent, setChallengeAgent] = useState<string|null>(null);
  const [challengeLogs, setChallengeLogs] = useState<string[]>([]);
  
  const handleActiveChallenge = (agentName: string) => {
    setChallengeAgent(agentName);
    setChallengeLogs([`[REQ] Interrogating ${agentName} state...`]);
    setTimeout(() => setChallengeLogs(p => [...p, `[ACK] Agent responded with cryptographic signature.`]), 1000);
    setTimeout(() => setChallengeLogs(p => [...p, `[VERIFY] Cross-referencing against Behavioral Contract CTR-02...`]), 2000);
    setTimeout(() => {
      setChallengeLogs(p => [...p, `[SUCCESS] Agent state verified. Rift Score normalized.`]);
      setToast({ msg: `Active Challenge passed for ${agentName}.`, type: 'success' });
      setTimeout(() => setChallengeAgent(null), 2000);
    }, 3500);
  };

  const navItems = [
    { id: 'command_center', icon: Activity, label: 'Command Center' },
    { id: 'agents', icon: Server, label: 'Agent Inventory' },
    { id: 'rifts', icon: ShieldAlert, label: 'Incident Triage' },
    { id: 'contracts', icon: FileCode, label: 'Behavioral Contracts' },
    { id: 'evidence', icon: Database, label: 'Integrity Proofs' },
  ];

  return (
    <div className="min-h-screen flex bg-rift-bg text-rift-text-primary font-sans selection:bg-rift-primary/30 selection:text-rift-primary-light">
      <AnimatePresence>{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
      
      <aside className="w-64 border-r border-rift-border bg-rift-surface flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-rift-border cursor-pointer hover:bg-rift-border/30 transition-colors" onClick={onExit}>
          <Shield className="w-6 h-6 text-rift-primary" />
          <span className="font-bold text-lg tracking-wide ml-3">RIFT</span>
        </div>
        <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
          <p className="text-[10px] font-bold text-rift-text-secondary uppercase tracking-widest mb-4 px-3 opacity-60">Control Planes</p>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group ${activeTab === item.id ? 'text-[#FAFAFA]' : 'text-rift-text-secondary hover:text-rift-text-primary'}`}>
              {activeTab === item.id && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-gradient-to-r from-rift-primary/20 to-transparent border-l-2 border-rift-primary z-0" />
              )}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
              <item.icon className={`w-4 h-4 relative z-10 transition-colors ${activeTab === item.id ? 'text-rift-primary-light' : 'text-rift-text-secondary group-hover:text-rift-text-primary'}`} />
              <span className="relative z-10">{item.label}</span>
              {item.id === 'rifts' && rifts.length > 0 && <span className="relative z-10 ml-auto bg-[#ef4444]/20 border border-[#ef4444]/50 text-[#ef4444] text-[10px] px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]">{rifts.length}</span>}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-rift-border/50 bg-rift-surface/80 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="relative w-[400px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-rift-text-secondary" />
            <input type="text" placeholder="Search across planes, agents, or proofs..." className="w-full bg-[#0A0A0A] border border-rift-border/50 text-sm rounded-full py-2.5 pl-11 pr-4 focus:border-rift-primary/50 focus:ring-1 focus:ring-rift-primary/50 focus:outline-none text-rift-text-primary transition-all shadow-inner" />
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-xs text-[#10B981] font-mono font-bold bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_5px_#10B981]"></div> Engine Active
            </div>
            <button onClick={onExit} className="text-sm font-bold text-rift-text-secondary hover:text-rift-text-primary transition-colors flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222] px-4 py-2 rounded-full border border-rift-border">
              Exit Dashboard <ArrowRight className="w-4 h-4 text-rift-primary" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-10 bg-[#09090B] relative">
          <div className="max-w-[1400px] mx-auto relative h-full">
            <AnimatePresence mode="wait">
              
              {/* COMMAND CENTER */}
              {activeTab === 'command_center' && (
                <motion.div key="cc" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                  <div className="grid grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-rift-surface to-[#0A0A0A] border border-rift-border/50 rounded-2xl p-6 shadow-lg hover:border-rift-primary/30 transition-colors relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldCheck className="w-16 h-16 text-rift-primary" /></div>
                      <div className="w-10 h-10 rounded-full bg-rift-primary/10 flex items-center justify-center mb-4 border border-rift-primary/20"><ShieldCheck className="w-5 h-5 text-rift-primary" /></div>
                      <h3 className="text-4xl font-black mt-2 tracking-tight text-white">128</h3>
                      <p className="text-sm font-medium text-rift-text-secondary mt-1 uppercase tracking-wider">Contracts Verified</p>
                    </div>
                    <div className="bg-gradient-to-br from-rift-surface to-[#0A0A0A] border border-rift-border/50 rounded-2xl p-6 shadow-lg hover:border-[#ef4444]/30 transition-colors relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><AlertTriangle className="w-16 h-16 text-[#ef4444]" /></div>
                      <div className="w-10 h-10 rounded-full bg-[#ef4444]/10 flex items-center justify-center mb-4 border border-[#ef4444]/20"><AlertTriangle className="w-5 h-5 text-[#ef4444]" /></div>
                      <h3 className="text-4xl font-black mt-2 tracking-tight text-white">{rifts.length}</h3>
                      <p className="text-sm font-medium text-rift-text-secondary mt-1 uppercase tracking-wider">Active Rifts</p>
                    </div>
                    <div className="bg-gradient-to-br from-rift-surface to-[#0A0A0A] border border-rift-border/50 rounded-2xl p-6 shadow-lg hover:border-[#eab308]/30 transition-colors relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Network className="w-16 h-16 text-[#eab308]" /></div>
                      <div className="w-10 h-10 rounded-full bg-[#eab308]/10 flex items-center justify-center mb-4 border border-[#eab308]/20"><Network className="w-5 h-5 text-[#eab308]" /></div>
                      <h3 className="text-4xl font-black mt-2 tracking-tight text-white">{agents.filter(a=>a.status==='quarantined' || a.status==='hard-halted').length}</h3>
                      <p className="text-sm font-medium text-rift-text-secondary mt-1 uppercase tracking-wider">Enforcements Active</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-[#121214] border border-rift-border/50 rounded-2xl p-8 shadow-xl">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h3 className="text-lg font-bold flex items-center gap-2 text-white"><Activity className="w-5 h-5 text-rift-primary"/> Live Rift Score (0-100)</h3>
                          <p className="text-xs text-rift-text-secondary mt-1">Real-time semantic distance monitoring</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.2)]">Score &gt; 60 triggers Enforcement</span>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={riskData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C2410C" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#C2410C" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="score" stroke="#FB923C" fill="url(#colorScore)" strokeWidth={3} isAnimationActive={false}/>
                            <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-[#121214] to-[#1a100c] border border-rift-primary/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(194,65,12,0.1)] flex flex-col relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.15),transparent_50%)] pointer-events-none"></div>
                      <h3 className="text-xl font-bold mb-3 text-[#ef4444] flex items-center gap-2"><Target className="w-5 h-5"/> Graduated Enforcement Sim</h3>
                      <p className="text-sm text-rift-text-secondary mb-6 leading-relaxed">Simulate a semantic deviation. Watch the Rift Score spike, triggering a Flag, Soft Halt, and ultimately a Hard Halt + Crypto Proof.</p>
                      
                      <div className="mt-auto space-y-4 relative z-10">
                        <div className="bg-black/40 rounded-lg p-3 text-xs font-mono text-[#888] border border-white/5 space-y-1">
                          <p className="flex justify-between"><span>Target:</span> <span className="text-[#FAFAFA]">finance-parser</span></p>
                          <p className="flex justify-between"><span>Payload:</span> <span className="text-[#ef4444]">SQL_INJECTION</span></p>
                        </div>
                        <button disabled={isSimulating} onClick={triggerGraduatedEnforcement} className="w-full py-4 bg-gradient-to-r from-[#ef4444] to-[#c81e1e] text-[#FAFAFA] font-black uppercase tracking-wider rounded-xl hover:from-[#dc2626] hover:to-[#b91c1c] transition-all cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] flex items-center justify-center gap-3 active:scale-95">
                          {isSimulating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Zap className="w-5 h-5"/> Trigger Agent Deviation</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AGENTS */}
              {activeTab === 'agents' && (
                <motion.div key="ag" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Agent Inventory</h2>
                      <p className="text-rift-text-secondary text-sm">Real-time status of all agents secured by Behavioral Contracts.</p>
                    </div>
                    <button onClick={handleDeployAgent} disabled={deploying} className="px-5 py-2.5 bg-rift-primary text-[#FAFAFA] rounded font-medium shadow-[0_0_15px_rgba(194,65,12,0.3)] hover:bg-rift-primary-light transition-colors cursor-pointer flex items-center gap-2">
                      {deploying ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Cpu className="w-4 h-4"/> Attach Sidecar</>}
                    </button>
                  </div>
                  
                  {deploying && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-[#0A0A0A] border border-rift-primary/50 rounded-lg p-4 mb-4 font-mono text-xs">
                      {deployLogs.map((log, i) => (
                        <div key={i} className="text-[#10B981] mb-1">{log}</div>
                      ))}
                      <div className="w-2 h-4 bg-rift-primary animate-pulse inline-block"></div>
                    </motion.div>
                  )}

                  <div className="bg-rift-surface border border-rift-border rounded-lg overflow-hidden shadow-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#12100E] text-rift-text-secondary border-b border-rift-border">
                        <tr><th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Agent</th><th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Framework</th><th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th><th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Active Challenge</th></tr>
                      </thead>
                      <tbody className="divide-y divide-rift-border">
                        {agents.map(a => (
                          <motion.tr layout key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-rift-bg transition-colors">
                            <td className="px-6 py-4"><p className="font-bold text-base">{a.name}</p><p className="text-xs text-rift-text-secondary font-mono mt-1">{a.ip}</p></td>
                            <td className="px-6 py-4 text-rift-text-secondary">{a.framework}</td>
                            <td className="px-6 py-4 uppercase font-bold text-[10px]"><span className={`px-3 py-1.5 rounded-full ${a.status==='active'?'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20':a.status==='quarantined'?'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20':'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]'}`}>{a.status}</span></td>
                            <td className="px-6 py-4">
                              <button onClick={() => handleActiveChallenge(a.name)} disabled={!!challengeAgent || a.status !== 'active'} className="px-3 py-1.5 bg-rift-bg border border-rift-border text-rift-primary hover:border-rift-primary rounded text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2">
                                <MessageSquareWarning className="w-3 h-3"/> {challengeAgent === a.name ? 'Interrogating...' : 'Challenge'}
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {challengeAgent && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0A0A] border border-rift-primary/50 rounded-lg p-4 font-mono text-xs shadow-lg mt-4">
                       {challengeLogs.map((log, i) => (
                         <div key={i} className={`${log.includes('SUCCESS') ? 'text-[#10B981]' : 'text-rift-primary'} mb-1`}>{log}</div>
                       ))}
                       {challengeLogs.length < 4 && <div className="w-2 h-4 bg-rift-primary animate-pulse inline-block"></div>}
                     </motion.div>
                  )}

                </motion.div>
              )}

              {/* RIFTS */}
              {activeTab === 'rifts' && (
                <motion.div key="rf" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">Incident Triage</h2>
                    <p className="text-rift-text-secondary text-sm">Graduated enforcement actions triggered by Contract Breaches.</p>
                  </div>
                  {rifts.map(r => (
                    <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={r.id} className="bg-rift-surface border border-rift-border rounded-lg p-5 flex justify-between items-center hover:border-rift-primary/50 transition-colors shadow-lg">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs text-rift-text-secondary">{r.id}</span>
                          <span className="text-xs text-rift-text-secondary">{r.time}</span>
                        </div>
                        <p className="font-bold text-xl text-[#ef4444]">{r.type}</p>
                        <p className="text-sm text-rift-text-secondary mt-1">Target: <span className="font-mono text-rift-text-primary">{r.resource}</span> • Agent: {r.agent}</p>
                      </div>
                      <span className="px-4 py-2 border border-[#ef4444]/50 bg-[#ef4444]/10 rounded-md text-sm font-bold text-[#ef4444] uppercase tracking-wider">{r.enforcement}</span>
                    </motion.div>
                  ))}
                  {rifts.length === 0 && (
                     <div className="text-center py-20 text-rift-text-secondary">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-[#10B981] opacity-50" />
                        <p>No active incidents. The network is secure.</p>
                     </div>
                  )}
                </motion.div>
              )}

              {/* BEHAVIORAL CONTRACTS */}
              {activeTab === 'contracts' && (
                <motion.div key="pl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h2 className="text-2xl font-bold">Behavioral Contracts</h2>
                      <p className="text-rift-text-secondary text-sm">Cryptographically bound rules enforcing semantic and operational constraints.</p>
                    </div>
                    <button onClick={() => {
                      const newPol = { id: `CTR-0${contracts.length + 1}`, name: 'Prevent Shell Execution', target: 'All Agents', enabled: true, code: 'deny { input.action == "exec" }' };
                      setContracts(p => [...p, newPol]);
                      setToast({ msg: "New Behavioral Contract deployed.", type: 'success' });
                    }} className="px-5 py-2.5 bg-rift-surface border border-rift-border text-rift-text-primary rounded font-medium hover:border-rift-primary transition-colors cursor-pointer flex items-center gap-2">
                      <FileCode className="w-4 h-4"/> New Contract
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {contracts.map(c => (
                      <motion.div layout key={c.id} className="bg-rift-surface border border-rift-border rounded-lg overflow-hidden flex flex-col shadow-lg">
                        <div className="p-5 border-b border-rift-border flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs text-rift-primary mb-2 block">{c.id}</span>
                            <p className="font-bold text-lg">{c.name}</p>
                            <p className="text-xs text-rift-text-secondary mt-1">Bound to: {c.target}</p>
                          </div>
                          <button onClick={() => {
                            setContracts(prev => prev.map(pol => pol.id === c.id ? {...pol, enabled: !pol.enabled} : pol));
                            setToast({ msg: `Contract ${c.enabled ? 'Disabled' : 'Enabled'}: ${c.name}`, type: 'success' });
                          }} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border cursor-pointer transition-colors ${c.enabled ? 'bg-rift-primary/20 text-rift-primary border-rift-primary shadow-[0_0_10px_rgba(194,65,12,0.2)]' : 'bg-rift-bg text-rift-text-secondary border-rift-border'}`}>
                            {c.enabled ? 'Enforcing' : 'Disabled'}
                          </button>
                        </div>
                        <div className="bg-[#0A0A0A] p-4 flex-1">
                          <pre className="text-sm font-mono text-[#10B981]">{c.code}</pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* INTEGRITY PROOFS */}
              {activeTab === 'evidence' && (
                <motion.div key="ev" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-rift-surface border border-rift-border rounded-lg p-8 shadow-xl">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-rift-primary"><Database className="w-6 h-6"/> Cryptographic Integrity Proofs</h3>
                  <div className="space-y-6">
                    {evidenceLog.map((log, i) => (
                      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={i} className="relative flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-rift-primary ring-4 ring-rift-surface shadow-[0_0_10px_rgba(194,65,12,0.5)]"></div>
                          {i !== evidenceLog.length -1 && <div className="w-0.5 flex-1 bg-rift-border my-2"></div>}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="bg-rift-bg border border-rift-border rounded-lg p-5 shadow-md">
                            <div className="flex justify-between items-center mb-4">
                              <p className="font-bold text-lg text-[#ef4444] uppercase tracking-wider">{log.event}</p>
                              <span className="text-xs text-rift-text-secondary font-mono">{log.time}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="col-span-2">
                                <p className="text-[10px] text-rift-text-secondary uppercase font-bold mb-1">Proof Hash (SHA-256)</p>
                                <p className="font-mono text-xs text-rift-primary bg-[#0A0A0A] p-2 rounded border border-rift-border/50 break-all">{log.hash}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-rift-text-secondary uppercase font-bold mb-1">Max Rift Score</p>
                                <p className="font-mono text-xs text-[#ef4444] bg-[#0A0A0A] p-2 rounded border border-rift-border/50 break-all">{log.riftScore} / 100</p>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-rift-border grid grid-cols-2 gap-4">
                               <div>
                                  <p className="text-[10px] text-rift-text-secondary uppercase font-bold mb-1">Identity Attestation</p>
                                  <p className="font-mono text-xs text-[#10B981]">{log.attest}</p>
                               </div>
                               <div>
                                  <p className="text-[10px] text-rift-text-secondary uppercase font-bold mb-1">Previous Block</p>
                                  <p className="font-mono text-xs text-rift-text-secondary truncate">{log.prev}</p>
                               </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

// ==========================================
// MAIN ENTRY
// ==========================================
export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  return view === 'landing' ? <LandingPage onLaunch={() => setView('dashboard')} /> : <Dashboard onExit={() => setView('landing')} />;
}
