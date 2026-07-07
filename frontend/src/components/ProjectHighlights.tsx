import { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';
import { Trophy, Users, Calendar, MapPin, TrendingUp, Sparkles } from 'lucide-react';
import { motion, useInView } from 'motion/react';

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * end);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [target, isInView]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

export default function ProjectHighlights() {
  const [activeMetric, setActiveMetric] = useState<'audience' | 'campaigns'>('audience');

  const chartData = [
    { year: '2021', audience: 1.2, campaigns: 35 },
    { year: '2022', audience: 1.8, campaigns: 58 },
    { year: '2023', audience: 2.5, campaigns: 85 },
    { year: '2024', audience: 4.0, campaigns: 130 },
    { year: '2025', audience: 5.8, campaigns: 195 },
    { year: '2026', audience: 8.4, campaigns: 280 }
  ];

  return (
    <section className="bg-slate-50 dark:bg-[#060a17] py-20 border-t border-slate-200 dark:border-white/10" id="project-highlights-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3" id="highlights-header">
          <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
            KREASI_METRICS_DASHBOARD
          </span>
          <h2 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tighter text-slate-950 dark:text-white">
            PENCAPAIAN & PERTUMBUHAN
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Data riil peningkatan impresi iklan luar ruang dan jumlah penayangan kampanye sukses kami dari tahun ke tahun di Sumatera Barat.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch" id="highlights-container">
          
          {/* Left Column: Metric Cards with Animated Counters */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4" id="highlights-counters">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Card 1: Projects Completed */}
              <div className="p-6 bg-white dark:bg-[#0c1226] border-2 border-slate-200 dark:border-white/5 relative group hover:border-brand dark:hover:border-brand-secondary transition-all duration-300">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-brand dark:text-brand-secondary group-hover:bg-brand group-hover:text-white dark:group-hover:bg-brand-secondary dark:group-hover:text-slate-950 transition-colors duration-300 mb-4">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white tracking-tight">
                  <AnimatedCounter target={280} suffix="+" />
                </div>
                <p className="text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-1">
                  KAMPANYE SUKSES
                </p>
              </div>

              {/* Card 2: Happy Clients */}
              <div className="p-6 bg-white dark:bg-[#0c1226] border-2 border-slate-200 dark:border-white/5 relative group hover:border-brand dark:hover:border-brand-secondary transition-all duration-300">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-brand dark:text-brand-secondary group-hover:bg-brand group-hover:text-white dark:group-hover:bg-brand-secondary dark:group-hover:text-slate-950 transition-colors duration-300 mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white tracking-tight">
                  <AnimatedCounter target={95} suffix="%" />
                </div>
                <p className="text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-1">
                  MITRA PUAS & KEMBALI
                </p>
              </div>

              {/* Card 3: Years Experience */}
              <div className="p-6 bg-white dark:bg-[#0c1226] border-2 border-slate-200 dark:border-white/5 relative group hover:border-brand dark:hover:border-brand-secondary transition-all duration-300">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-brand dark:text-brand-secondary group-hover:bg-brand group-hover:text-white dark:group-hover:bg-brand-secondary dark:group-hover:text-slate-950 transition-colors duration-300 mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white tracking-tight">
                  <AnimatedCounter target={10} suffix="+" />
                </div>
                <p className="text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-1">
                  TAHUN PENGALAMAN
                </p>
              </div>

              {/* Card 4: Strategic Billboard Spots */}
              <div className="p-6 bg-white dark:bg-[#0c1226] border-2 border-slate-200 dark:border-white/5 relative group hover:border-brand dark:hover:border-brand-secondary transition-all duration-300">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-brand dark:text-brand-secondary group-hover:bg-brand group-hover:text-white dark:group-hover:bg-brand-secondary dark:group-hover:text-slate-950 transition-colors duration-300 mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white tracking-tight">
                  <AnimatedCounter target={120} suffix="+" />
                </div>
                <p className="text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-1">
                  TITIK STRATEGIS AKTIF
                </p>
              </div>

            </div>

            {/* Quick Stat Insights Box */}
            <div className="bg-slate-950 dark:bg-black text-white p-6 border-l-4 border-brand-secondary flex items-start gap-4 shadow-xl">
              <TrendingUp className="w-8 h-8 text-brand-secondary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-black uppercase text-brand-secondary tracking-wider">
                  STAT_SUMMARY_ANALYSIS
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  Peningkatan rata-rata jangkauan penonton periklanan luar ruang kami di Bukittinggi & Agam naik hingga <span className="text-white font-bold font-mono">35%</span> di setiap kuartal berkat pemilihan lampu sorot berdaya tinggi dan restrukturisasi papan baliho.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Recharts Interactive Interactive Chart */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0c1226] border-2 border-slate-200 dark:border-white/5 p-6 sm:p-8 flex flex-col justify-between" id="highlights-chart-box">
            
            {/* Chart Options Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4 mb-6">
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-black uppercase text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand dark:text-brand-secondary" />
                  GRAFIK TREN PERTUMBUHAN KREASI
                </h3>
                <p className="text-[10px] text-neutral-500">Pilih indikator grafik interaktif di bawah:</p>
              </div>
              
              {/* Option Selector Buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setActiveMetric('audience')}
                  className={`px-3 py-1.5 text-[9px] font-mono font-black tracking-wider transition-all duration-300 border cursor-pointer ${
                    activeMetric === 'audience'
                      ? 'bg-brand text-white border-brand dark:bg-brand-secondary dark:text-slate-950 dark:border-brand-secondary'
                      : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-white/5 hover:border-slate-300'
                  }`}
                  id="btn-metric-audience"
                >
                  JANGKAUAN IMPRESI (JUTAAN)
                </button>
                <button
                  onClick={() => setActiveMetric('campaigns')}
                  className={`px-3 py-1.5 text-[9px] font-mono font-black tracking-wider transition-all duration-300 border cursor-pointer ${
                    activeMetric === 'campaigns'
                      ? 'bg-brand text-white border-brand dark:bg-brand-secondary dark:text-slate-950 dark:border-brand-secondary'
                      : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-white/5 hover:border-slate-300'
                  }`}
                  id="btn-metric-campaigns"
                >
                  TOTAL PROYEK BRAND
                </button>
              </div>
            </div>

            {/* Recharts Render Area */}
            <div className="w-full h-72 sm:h-80" id="recharts-container-element">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeMetric === 'audience' ? '#e10613' : '#3b82f6'} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={activeMetric === 'audience' ? '#e10613' : '#3b82f6'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" className="hidden dark:block" />
                  
                  <XAxis 
                    dataKey="year" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                  />
                  
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0c1226', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '0px',
                      color: '#ffffff',
                      fontFamily: 'monospace',
                      fontSize: '11px'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#ffcc00' }}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey={activeMetric} 
                    name={activeMetric === 'audience' ? 'Impresi (Jutaan/Bulan)' : 'Total Proyek Aktif'}
                    stroke={activeMetric === 'audience' ? '#e10613' : '#3b82f6'} 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorMetric)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Footnote inside the chart box */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 text-[9px] font-mono text-neutral-400 text-center uppercase tracking-wider">
              Data internal teraudit per Juni 2026 berdasarkan sensor impresi kamera lalu lintas dinamis.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
