import { useState } from 'react';
import { ChevronDown, HelpCircle, DollarSign, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FAQItem {
  id: string;
  category: 'all' | 'layanan' | 'harga' | 'wilayah';
  categoryLabel: string;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'layanan' | 'harga' | 'wilayah'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'SEMUA TANYA JAWAB' },
    { id: 'layanan', label: 'LAYANAN & TEKNIS' },
    { id: 'harga', label: 'HARGA & PAJAK' },
    { id: 'wilayah', label: 'CAKUPAN & GARANSI' }
  ] as const;

  const faqData: FAQItem[] = [
    {
      id: 'faq-layanan-1',
      category: 'layanan',
      categoryLabel: 'Layanan & Teknis',
      question: 'Layanan periklanan apa saja yang disediakan oleh Kreasi Advertising?',
      answer: 'Kami menyediakan jasa periklanan luar ruang (OOH) komprehensif mulai dari penyewaan titik Baliho/Billboard strategis di Bukittinggi & Agam, pengerjaan konstruksi reklame kustom, Neon Box toko, hingga cetak digital format besar (Banner/Spanduk) berketahanan tinggi.'
    },
    {
      id: 'faq-layanan-2',
      category: 'layanan',
      categoryLabel: 'Layanan & Teknis',
      question: 'Apakah kami bisa menyewa titik reklame baru yang belum memiliki struktur tiang?',
      answer: 'Tentu saja. Kami memiliki layanan pembangunan konstruksi baru (build-to-suit) sesuai lokasi target pasar Anda. Tim ahli sipil dan hubungan masyarakat kami akan mengurus analisis kelayakan struktur, perizinan tata ruang tata kota, hingga perolehan izin pajak reklame daerah secara lengkap.'
    },
    {
      id: 'faq-harga-1',
      category: 'harga',
      categoryLabel: 'Harga & Pajak',
      question: 'Bagaimana penentuan biaya sewa billboard atau baliho di Bukittinggi?',
      answer: 'Harga sewa ditentukan secara transparan berdasarkan letak geografis titik (tingkat lalu lintas harian), dimensi media reklame (seperti 4x6m, 4x8m, atau 5x10m), durasi kontrak sewa (3 bulan, 6 bulan, atau 1 tahun), serta ada/tidaknya pencahayaan sorot LED malam hari.'
    },
    {
      id: 'faq-harga-2',
      category: 'harga',
      categoryLabel: 'Harga & Pajak',
      question: 'Apakah tarif sewa yang tertera sudah mencakup pajak daerah dan pemeliharaan?',
      answer: 'Ya, seluruh penawaran harga kami bersifat all-inclusive (bersih). Tarif sewa sudah mencakup pajak reklame daerah (Bapenda), retribusi perizinan Dinas PTSP, koordinasi lingkungan, serta biaya pemeliharaan berkala selama masa kontrak penayangan aktif.'
    },
    {
      id: 'faq-wilayah-1',
      category: 'wilayah',
      categoryLabel: 'Cakupan & Garansi',
      question: 'Di mana saja cakupan area (coverage) penayangan iklan Kreasi Advertising?',
      answer: 'Fokus area utama kami berada di wilayah premium Kota Bukittinggi (seperti Jalan Jenderal Sudirman, Bundaran Simpang Aur, kawasan Jam Gadang) serta koridor utama Kabupaten Agam, Payakumbuh, Padang Panjang, dan jalan lintas Padang-Bukittinggi.'
    },
    {
      id: 'faq-wilayah-2',
      category: 'wilayah',
      categoryLabel: 'Cakupan & Garansi',
      question: 'Bagaimana prosedur garansi jika lampu sorot mati atau visual reklame rusak?',
      answer: 'Keandalan visual Anda adalah prioritas utama kami. Jika lampu sorot LED padam, teknisi kami akan melakukan perbaikan maksimal dalam 2x24 jam sejak laporan diterima. Untuk materi visual (banner/spanduk) yang rusak akibat badai atau cuaca ekstrem, kami akan mencetak ulang dan memasangnya kembali secara GRATIS tanpa tambahan biaya.'
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'layanan':
        return <HelpCircle className="w-4 h-4" />;
      case 'harga':
        return <DollarSign className="w-4 h-4" />;
      case 'wilayah':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <section className="bg-slate-50 dark:bg-[#070B19] py-20 border-t-2 border-slate-200 dark:border-white/10" id="faq-section-wrapper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Block */}
        <div className="text-center space-y-3" id="faq-title-block">
          <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
            KREASI_FAQ_CENTRAL
          </span>
          <h2 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tighter text-slate-950 dark:text-white">
            PERTANYAAN UMUM
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Dapatkan informasi cepat mengenai cakupan area strategis, kebijakan transparansi harga, dan skema pemeliharaan media reklame kami.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2" id="faq-tabs-container">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setExpandedId(null); // collapse when category changes
              }}
              className={`px-4 py-2 text-[10px] font-black font-mono tracking-wider transition-all duration-300 border rounded-none cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand text-white border-brand dark:bg-brand-secondary dark:text-slate-950 dark:border-brand-secondary shadow-md'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-brand/40 dark:bg-[#0c1226] dark:text-slate-200 dark:border-white/5 dark:hover:border-white/20'
              }`}
              id={`faq-tab-btn-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List Accordion */}
        <div className="max-w-3xl mx-auto space-y-4" id="faq-accordion-list">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <motion.div
                  layout
                  key={faq.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className={`border-2 transition-all duration-300 rounded-none bg-white dark:bg-[#0c1226] ${
                    isOpen 
                      ? 'border-brand dark:border-brand-secondary shadow-lg' 
                      : 'border-slate-200 dark:border-white/5 hover:border-brand/30 dark:hover:border-white/10'
                  }`}
                  id={`faq-card-${faq.id}`}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 font-sans focus:outline-none select-none cursor-pointer min-h-[50px]"
                    id={`faq-accordion-btn-${faq.id}`}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-none border flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen 
                          ? 'bg-brand text-white border-brand dark:bg-brand-secondary dark:text-slate-950 dark:border-brand-secondary' 
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-white/5'
                      }`}>
                        {getCategoryIcon(faq.category)}
                      </div>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-950 dark:text-white leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand dark:text-brand-secondary' : ''
                    }`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-slate-100 dark:border-white/5">
                          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                            {faq.answer}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="bg-slate-150 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[8px] font-mono font-black px-2 py-0.5 rounded-none text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Kategori: {faq.categoryLabel}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
