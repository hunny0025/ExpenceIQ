import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart, 
  PieChart, 
  Shield, 
  TrendingUp, 
  Wallet, 
  Zap 
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-200 selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-violet-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] w-full border-b border-white/5 bg-[#030712]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ExpenceIQ
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 text-sm font-bold bg-white text-black hover:bg-slate-200 rounded-full transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-400 text-xs font-bold uppercase tracking-widest animate-fade-in">
              <Zap className="w-3.5 h-3.5 fill-violet-400" />
              <span>Next-Gen Finance Management</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
              Master Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400">
                Financial Empire
              </span>
            </h1>
            
            {/* Description */}
            <p className="max-w-2xl text-xl text-slate-400 leading-relaxed font-medium">
              Join 10,000+ users who have transformed their spending habits. 
              Track, analyze, and optimize your wealth with one beautiful dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
              <Link 
                to="/signup" 
                className="group relative w-full sm:w-auto px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(124,58,237,0.3)] flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all backdrop-blur-sm"
              >
                Live Preview
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-4xl border-t border-white/5">
              <StatItem label="Active Users" value="10k+" />
              <StatItem label="Volume Tracked" value="$2M+" />
              <StatItem label="Uptime Record" value="99.9%" />
              <StatItem label="User Satisfaction" value="4.9/5" />
            </div>
          </div>

          {/* Features Preview */}
          <div id="features" className="mt-40 grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="w-7 h-7 text-emerald-400" />}
              title="Real-time Tracking"
              description="Instantly log expenses from any device. Our smart engine categorizes them automatically."
              color="emerald"
            />
            <FeatureCard 
              icon={<PieChart className="w-7 h-7 text-violet-400" />}
              title="Dynamic Budgets"
              description="Set custom thresholds for every category and get smart alerts before you overspend."
              color="violet"
            />
            <FeatureCard 
              icon={<BarChart className="w-7 h-7 text-blue-400" />}
              title="Wealth Analytics"
              description="Visualize your financial trajectory with high-fidelity charts and deep-dive insights."
              color="blue"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#020617] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-white">ExpenceIQ</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs font-medium">
                The world's most beautiful and intuitive expense management platform.
              </p>
            </div>
            
            <div className="flex gap-12 text-sm font-bold">
              <div className="flex flex-col gap-4">
                <span className="text-white uppercase tracking-widest text-[10px]">Product</span>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">Features</a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">Security</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-white uppercase tracking-widest text-[10px]">Company</span>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-600">
            <div>© 2024 ExpenceIQ. Built for the future of finance.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400">Twitter</a>
              <a href="#" className="hover:text-slate-400">GitHub</a>
              <a href="#" className="hover:text-slate-400">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'hover:border-emerald-500/30 group-hover:bg-emerald-500/10',
    violet: 'hover:border-violet-500/30 group-hover:bg-violet-500/10',
    blue: 'hover:border-blue-500/30 group-hover:bg-blue-500/10',
  };

  return (
    <div className={`p-10 rounded-[32px] bg-white/[0.02] border border-white/5 transition-all duration-500 group ${colorMap[color]}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-8 border border-white/5 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  );
}

