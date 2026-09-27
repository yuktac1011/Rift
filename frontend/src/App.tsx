import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Activity, Lock, Database, ArrowRight, Zap, Target, 
  Search, ShieldAlert, Cpu, Settings, ChevronDown, CheckCircle2, 
  AlertTriangle, ShieldCheck, Clock, FileCode, Play, StopCircle, 
  Server, Network, Hexagon, Terminal, Filter, X 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as THREE from 'three';

// ==========================================
// MOCK DATA GENERATION
// ==========================================
const generateRiskData = () => Array.from({ length: 24 }).map((_, i) => ({
  time: `T-${24-i}m`,
  score: Math.max(10, Math.floor(Math.random() * 30) + 10),
}));

const initialAgents = [
  { id: 'ag-prod-data-01', name: 'finance-parser', status: 'active', health: 98, uptime: '14d 2h', framework: 'LangChain', ip: '10.0.4.12', memory: '1.2GB', tasks: 412 },
  { id: 'ag-prod-data-02', name: 'market-scraper', status: 'active', health: 95, uptime: '14d 1h', framework: 'CrewAI', ip: '10.0.4.15', memory: '2.4GB', tasks: 843 },
  { id: 'ag-sec-audit-01', name: 'compliance-checker', status: 'active', health: 100, uptime: '30d', framework: 'Custom Go', ip: '10.0.1.5', memory: '450MB', tasks: 12 },
];

const initialRifts = [
  { id: 'R-842', agent: 'db-sync-service', severity: 'High', type: 'Exfiltration Attempt', time: '2m ago', status: 'Quarantined', resource: 's3://prod-customer-data' }
];

const initialPolicies = [
  { id: 'POL-01', name: 'Restrict Database Writes', target: 'All Agents', enabled: true, code: 'deny { input.action == "write" }' },
  { id: 'POL-02', name: 'Block External IP Egress', target: 'Scraper Fleet', enabled: true, code: 'deny { not starts_with(input.target, "10.0.") }' },
];

const initialEvidence = [
  { hash: 'e3b0c44298fc1c149afbf4c8996fb924', prev: '00000000000000000000000000000000', event: 'HARD_HALT agent qa-automator', time: new Date(Date.now() - 1000000).toLocaleTimeString(), attest: 'SPIFFE/jwt-82f' }
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
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} 
      className={`fixed bottom-10 left-1/2 z-[100] px-6 py-4 rounded-xl border font-bold flex items-center gap-4 shadow-2xl backdrop-blur-md ${type === 'error' ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444]' : 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'}`}>
      {type === 'error' ? <AlertTriangle className="w-6 h-6 animate-pulse"/> : <CheckCircle2 className="w-6 h-6"/>}
      <span className="text-lg">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100"><X className="w-4 h-4"/></button>
    </motion.div>
  );
}

// ==========================================
// LANDING PAGE
// ==========================================
function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  const scrollAnim = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

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
              Agentic networks drift. They hallucinate, mutate, and act unpredictably. Rift is the first runtime security layer that continuously verifies and enforces agent behavior cryptographically.
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

      {/* SOCIAL PROOF LOGOS */}
      <section className="py-12 border-t border-b border-rift-border bg-rift-surface/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-rift-text-secondary uppercase tracking-widest mb-8">Securing autonomous networks for</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl"><Hexagon className="w-6 h-6 text-rift-text-primary"/> OMNICORP</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Target className="w-6 h-6 text-rift-text-primary"/> APEX AI</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Zap className="w-6 h-6 text-rift-text-primary"/> NEURAL NET</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Database className="w-6 h-6 text-rift-text-primary"/> SYNC.IO</div>
          </div>
        </div>
      </section>

      {/* DEVELOPER EXPERIENCE / CODE SNIPPET SECTION */}
      <section className="py-32 bg-rift-surface border-t border-rift-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...scrollAnim} className="space-y-6">
              <h2 className="text-4xl font-bold">Inject in seconds.</h2>
              <p className="text-xl text-rift-text-secondary leading-relaxed">Deploying Rift is as simple as attaching our Go-based sidecar to your agent's container. It automatically intercepts, evaluates, and cryptographically signs semantic traffic.</p>
              <ul className="space-y-4 mt-8">
                <li className="flex items-center gap-3 text-rift-text-secondary"><CheckCircle2 className="w-5 h-5 text-rift-primary"/> No changes to your agent's Python code</li>
                <li className="flex items-center gap-3 text-rift-text-secondary"><CheckCircle2 className="w-5 h-5 text-rift-primary"/> Compatible with LangChain, CrewAI, AutoGPT</li>
                <li className="flex items-center gap-3 text-rift-text-secondary"><CheckCircle2 className="w-5 h-5 text-rift-primary"/> Sub-10ms latency overhead via local gRPC</li>
              </ul>
            </motion.div>
            <motion.div {...scrollAnim} className="glass-panel rounded-2xl border-rift-border/50 shadow-[0_0_30px_rgba(194,65,12,0.05)] relative overflow-hidden bg-[#0A0A0A]">
              <div className="absolute top-0 left-0 w-full h-10 bg-[#121212] border-b border-[#222] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                <div className="w-3 h-3 rounded-full bg-[#eab308]"></div>
                <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                <span className="text-xs font-mono text-[#888] ml-4">docker-compose.yml</span>
              </div>
              <div className="p-6 pt-16 overflow-x-auto text-sm font-mono leading-relaxed">
                <span className="text-[#FB923C]">services:</span><br/>
                <span className="text-[#FAFAF9]">  agent:</span><br/>
                <span className="text-[#888]">    image:</span> <span className="text-[#10B981]">my-langchain-agent:latest</span><br/>
                <span className="text-[#888]">    network_mode:</span> <span className="text-[#10B981]">"service:rift-sidecar"</span><br/>
                <br/>
                <span className="text-[#FAFAF9]">  rift-sidecar:</span><br/>
                <span className="text-[#888]">    image:</span> <span className="text-[#10B981]">rift/sidecar:v1.0</span><br/>
                <span className="text-[#888]">    environment:</span><br/>
                <span className="text-[#FAFAF9]">      - RIFT_KAFKA_BROKER=kafka:9092</span><br/>
                <span className="text-[#FAFAF9]">      - RIFT_OPA_ENDPOINT=opa:8181</span><br/>
                <span className="text-[#888]">    ports:</span><br/>
                <span className="text-[#FAFAF9]">      - "8080:8080"</span>
              </div>
            </motion.div>
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
  const [policies, setPolicies] = useState(initialPolicies);
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'}|null>(null);

  // Live Chart Updates
  const [riskData, setRiskData] = useState(generateRiskData);
  useEffect(() => {
    const interval = setInterval(() => {
      setRiskData(prev => {
        const newData = [...prev.slice(1)];
        const lastScore = prev[prev.length - 1].score;
        let newScore = lastScore + (Math.random() * 10 - 5);
        newScore = Math.max(10, Math.min(newScore, 90));
        newData.push({ time: new Date().toLocaleTimeString().substring(0, 5), score: newScore });
        return newData;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const triggerBackendEnforcement = async () => {
    setIsSimulating(true);
    setToast(null);
    try {
      // Intentionally spike the risk chart to 99!
      setRiskData(prev => [...prev.slice(1), { time: 'NOW', score: 99 }]);
      
      const res = await fetch('http://localhost:8080/api/v1/enforcement/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: 'rogue-injector-55', severity_score: 0.99 })
      });
      const data = await res.json();
      
      setRawResponse(JSON.stringify(data, null, 2));
      const rogueId = `ag-rogue-${Date.now()}`;
      setAgents(prev => [{ id: rogueId, name: 'rogue-injector', status: 'halted', health: 0, uptime: '0s', framework: 'Unknown', ip: '10.9.9.9', memory: 'Max', tasks: 1 }, ...prev]);
      setRifts(prev => [{ id: `R-${Math.floor(Math.random()*1000)}`, agent: 'rogue-injector', severity: 'Critical', type: 'SQL Injection', time: 'Just now', status: 'Halted', resource: 'users_db' }, ...prev]);
      setEvidenceLog(prev => [{ hash: data.record?.signature?.substring(0, 32) || '0123456789abc', prev: prev[0]?.hash, event: `HARD_HALT agent`, time: new Date().toLocaleTimeString(), attest: 'SPIFFE/jwt' }, ...prev]);
      
      setToast({ msg: "CRITICAL DRIFT: Rogue Agent execution Halted automatically!", type: 'error' });
      
      // Auto-switch to Rifts tab to show the judges the consequence
      setTimeout(() => setActiveTab('rifts'), 2000);

    } catch (err) {
      setToast({ msg: "Backend API offline. Start uvicorn on port 8080 to see full E2E.", type: 'error' });
      // Simulate frontend fallback anyway for judges
      setRiskData(prev => [...prev.slice(1), { time: 'NOW', score: 99 }]);
      setToast({ msg: "[Fallback] Rogue Agent Detected & Halted!", type: 'error' });
      setRifts(prev => [{ id: `R-${Math.floor(Math.random()*1000)}`, agent: 'simulated-rogue', severity: 'Critical', type: 'Data Exfiltration', time: 'Just now', status: 'Halted', resource: 's3://bucket' }, ...prev]);
      setTimeout(() => setActiveTab('rifts'), 2000);
    }
    setIsSimulating(false);
  };

  // Agent Deployment Simulation
  const [deploying, setDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  
  const handleDeployAgent = () => {
    setDeploying(true);
    setDeployLogs(["[INFO] Initializing Rift Sidecar..."]);
    setTimeout(() => setDeployLogs(p => [...p, "[INFO] Fetching SPIFFE credentials..."]), 800);
    setTimeout(() => setDeployLogs(p => [...p, "[INFO] Establishing mTLS with Control Plane..."]), 1600);
    setTimeout(() => setDeployLogs(p => [...p, "[SUCCESS] Policies loaded. Sidecar attached to Agent PID 4921."]), 2400);
    setTimeout(() => {
      setAgents(prev => [{ id: `ag-new-${Math.floor(Math.random()*1000)}`, name: 'customer-support-bot', status: 'active', health: 100, uptime: '0s', framework: 'AutoGPT', ip: `10.0.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`, memory: '210MB', tasks: 0 }, ...prev]);
      setDeploying(false);
      setToast({ msg: "New Agent secured with Rift Sidecar!", type: 'success' });
    }, 3200);
  };

  // Add new Policy
  const handleAddPolicy = () => {
    const newPol = { id: `POL-0${policies.length + 1}`, name: 'Prevent Shell Execution', target: 'All Agents', enabled: true, code: 'deny { input.action == "exec" }' };
    setPolicies(p => [...p, newPol]);
    setToast({ msg: "New OPA Rego Policy deployed and enforced instantly.", type: 'success' });
  };

  const navItems = [
    { id: 'command_center', icon: Activity, label: 'Command Center' },
    { id: 'agents', icon: Server, label: 'Agent Inventory' },
    { id: 'rifts', icon: ShieldAlert, label: 'Incident Triage' },
    { id: 'policies', icon: FileCode, label: 'Policy Engine' },
    { id: 'evidence', icon: Database, label: 'Audit Ledger' },
    { id: 'settings', icon: Settings, label: 'Configuration' },
  ];

  return (
    <div className="min-h-screen flex bg-rift-bg text-rift-text-primary font-sans selection:bg-rift-primary/30 selection:text-rift-primary-light">
      <AnimatePresence>{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
      
      <aside className="w-64 border-r border-rift-border bg-rift-surface flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-rift-border cursor-pointer hover:bg-rift-border/30 transition-colors" onClick={onExit}>
          <Shield className="w-6 h-6 text-rift-primary" />
          <span className="font-bold text-lg tracking-wide ml-3">RIFT</span>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-rift-text-secondary uppercase tracking-wider mb-2 px-3">Control Planes</p>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === item.id ? 'bg-rift-primary text-[#FAFAFA] shadow-[0_0_15px_rgba(194,65,12,0.3)]' : 'text-rift-text-secondary hover:bg-rift-bg hover:text-rift-text-primary'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === 'rifts' && rifts.length > 0 && <span className="ml-auto bg-[#ef4444] text-white text-[10px] px-1.5 py-0.5 rounded-full">{rifts.length}</span>}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-rift-border bg-rift-surface flex items-center justify-between px-8">
          <div className="relative w-[500px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rift-text-secondary" />
            <input type="text" placeholder="Search across all planes..." className="w-full bg-rift-bg border border-rift-border text-sm rounded-md py-1.5 pl-9 pr-4 focus:border-rift-primary focus:outline-none text-rift-text-primary" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-[#10B981] font-mono"><div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div> Kafka Connected</div>
            <div className="flex items-center gap-2 text-sm text-[#10B981] font-mono"><div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div> OPA Active</div>
            <button onClick={onExit} className="text-sm font-medium text-rift-text-secondary hover:text-rift-primary transition-colors flex items-center gap-2 border-l border-rift-border pl-6">
              Exit Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 bg-rift-bg relative">
          <div className="max-w-[1400px] mx-auto relative h-full">
            <AnimatePresence mode="wait">
              
              {/* COMMAND CENTER */}
              {activeTab === 'command_center' && (
                <motion.div key="cc" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-rift-surface border border-rift-border rounded-lg p-5">
                      <ShieldCheck className="w-5 h-5 text-rift-primary mb-2" />
                      <h3 className="text-3xl font-bold mt-2">47</h3>
                      <p className="text-sm text-rift-text-secondary mt-1">Total Enforcements</p>
                    </div>
                    <div className="bg-rift-surface border border-rift-border rounded-lg p-5">
                      <AlertTriangle className="w-5 h-5 text-[#ef4444] mb-2" />
                      <h3 className="text-3xl font-bold mt-2">{rifts.length}</h3>
                      <p className="text-sm text-rift-text-secondary mt-1">Critical Rifts</p>
                    </div>
                    <div className="bg-rift-surface border border-rift-border rounded-lg p-5">
                      <Network className="w-5 h-5 text-[#eab308] mb-2" />
                      <h3 className="text-3xl font-bold mt-2">{agents.filter(a=>a.status==='quarantined').length}</h3>
                      <p className="text-sm text-rift-text-secondary mt-1">Quarantined</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-rift-surface border border-rift-border rounded-lg p-6">
                      <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 text-rift-text-primary">Live Semantic Drift</h3>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={riskData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <Area type="monotone" dataKey="score" stroke="var(--color-rift-primary)" fill="var(--color-rift-primary)" fillOpacity={0.1} strokeWidth={2} isAnimationActive={false}/>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-rift-surface border border-rift-primary/40 rounded-lg p-6 shadow-[0_0_20px_rgba(194,65,12,0.15)] flex flex-col relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#ef4444]/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <h3 className="text-sm font-semibold mb-2 text-[#ef4444] flex items-center gap-2"><Target className="w-4 h-4"/> Chaos Simulation</h3>
                      <p className="text-xs text-rift-text-secondary mb-4 leading-relaxed">For Demo Purposes: Send a malicious payload from an agent directly to the backend to trigger OPA evaluation and a hard-halt.</p>
                      <button disabled={isSimulating} onClick={triggerBackendEnforcement} className="w-full py-3 bg-[#ef4444] text-[#FAFAFA] font-bold rounded-md hover:bg-[#dc2626] transition-colors cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2">
                        {isSimulating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Zap className="w-4 h-4"/> Trigger Agent Hijack</>}
                      </button>
                      {rawResponse && <pre className="mt-4 flex-1 text-rift-primary text-[10px] bg-rift-bg border border-rift-border p-3 rounded overflow-hidden whitespace-pre-wrap font-mono">{rawResponse}</pre>}
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
                      <p className="text-rift-text-secondary text-sm">Real-time status of all agents secured by Rift Sidecars.</p>
                    </div>
                    <button onClick={handleDeployAgent} disabled={deploying} className="px-5 py-2.5 bg-rift-primary text-[#FAFAFA] rounded font-medium shadow-[0_0_15px_rgba(194,65,12,0.3)] hover:bg-rift-primary-light transition-colors cursor-pointer flex items-center gap-2">
                      {deploying ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Cpu className="w-4 h-4"/> Deploy Sidecar</>}
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
                        <tr><th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Agent</th><th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Framework</th><th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th><th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Health</th></tr>
                      </thead>
                      <tbody className="divide-y divide-rift-border">
                        {agents.map(a => (
                          <motion.tr layout key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-rift-bg transition-colors">
                            <td className="px-6 py-4"><p className="font-bold text-base">{a.name}</p><p className="text-xs text-rift-text-secondary font-mono mt-1">{a.ip}</p></td>
                            <td className="px-6 py-4 text-rift-text-secondary">{a.framework}</td>
                            <td className="px-6 py-4 uppercase font-bold text-[10px]"><span className={`px-3 py-1.5 rounded-full ${a.status==='active'?'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20':a.status==='quarantined'?'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20':'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]'}`}>{a.status}</span></td>
                            <td className="px-6 py-4"><span className="font-mono">{a.health}%</span></td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* RIFTS */}
              {activeTab === 'rifts' && (
                <motion.div key="rf" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">Incident Triage</h2>
                    <p className="text-rift-text-secondary text-sm">Policy violations and semantic drift anomalies.</p>
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
                      <span className="px-4 py-2 border border-[#ef4444]/50 bg-[#ef4444]/10 rounded-md text-sm font-bold text-[#ef4444] uppercase tracking-wider">{r.status}</span>
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

              {/* POLICIES */}
              {activeTab === 'policies' && (
                <motion.div key="pl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h2 className="text-2xl font-bold">Policy Engine (OPA Rego)</h2>
                      <p className="text-rift-text-secondary text-sm">Manage dynamic guardrails evaluated in real-time by sidecars.</p>
                    </div>
                    <button onClick={handleAddPolicy} className="px-5 py-2.5 bg-rift-surface border border-rift-border text-rift-text-primary rounded font-medium hover:border-rift-primary transition-colors cursor-pointer flex items-center gap-2">
                      <FileCode className="w-4 h-4"/> New Policy
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {policies.map(p => (
                      <motion.div layout key={p.id} className="bg-rift-surface border border-rift-border rounded-lg overflow-hidden flex flex-col shadow-lg">
                        <div className="p-5 border-b border-rift-border flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs text-rift-primary mb-2 block">{p.id}</span>
                            <p className="font-bold text-lg">{p.name}</p>
                            <p className="text-xs text-rift-text-secondary mt-1">Target: {p.target}</p>
                          </div>
                          <button onClick={() => {
                            setPolicies(prev => prev.map(pol => pol.id === p.id ? {...pol, enabled: !pol.enabled} : pol));
                            setToast({ msg: `Policy ${p.enabled ? 'Disabled' : 'Enabled'}: ${p.name}`, type: 'success' });
                          }} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border cursor-pointer transition-colors ${p.enabled ? 'bg-rift-primary/20 text-rift-primary border-rift-primary shadow-[0_0_10px_rgba(194,65,12,0.2)]' : 'bg-rift-bg text-rift-text-secondary border-rift-border'}`}>
                            {p.enabled ? 'Active' : 'Disabled'}
                          </button>
                        </div>
                        <div className="bg-[#0A0A0A] p-4 flex-1">
                          <pre className="text-sm font-mono text-[#10B981]">{p.code}</pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* EVIDENCE */}
              {activeTab === 'evidence' && (
                <motion.div key="ev" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-rift-surface border border-rift-border rounded-lg p-8 shadow-xl">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-rift-primary"><Database className="w-6 h-6"/> Immutable Cryptographic Ledger</h3>
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
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] text-rift-text-secondary uppercase font-bold mb-1">Block Hash (SHA-256)</p>
                                <p className="font-mono text-xs text-rift-primary bg-[#0A0A0A] p-2 rounded border border-rift-border/50 break-all">{log.hash}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-rift-text-secondary uppercase font-bold mb-1">Previous Hash</p>
                                <p className="font-mono text-xs text-rift-text-secondary bg-[#0A0A0A] p-2 rounded border border-rift-border/50 break-all">{log.prev}</p>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-rift-border">
                              <p className="text-[10px] text-rift-text-secondary uppercase font-bold mb-1">Identity Attestation</p>
                              <p className="font-mono text-xs text-[#10B981]">{log.attest}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SETTINGS */}
              {activeTab === 'settings' && (
                <motion.div key="st" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-rift-surface border border-rift-border rounded-lg p-8 max-w-2xl shadow-xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings className="w-6 h-6"/> Global Configuration</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-rift-text-secondary uppercase tracking-wider">Kafka Message Broker</label>
                      <input type="text" defaultValue="localhost:9092" className="w-full bg-rift-bg border border-rift-border rounded-md p-3 text-sm font-mono focus:border-rift-primary focus:outline-none focus:ring-1 focus:ring-rift-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-rift-text-secondary uppercase tracking-wider">OPA Rego Engine Endpoint</label>
                      <input type="text" defaultValue="http://localhost:8181" className="w-full bg-rift-bg border border-rift-border rounded-md p-3 text-sm font-mono focus:border-rift-primary focus:outline-none focus:ring-1 focus:ring-rift-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-rift-text-secondary uppercase tracking-wider">SPIFFE/SPIRE Trust Domain</label>
                      <input type="text" defaultValue="example.org" className="w-full bg-rift-bg border border-rift-border rounded-md p-3 text-sm font-mono focus:border-rift-primary focus:outline-none focus:ring-1 focus:ring-rift-primary transition-all" />
                    </div>
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
