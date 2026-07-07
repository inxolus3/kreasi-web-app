import { useState } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatarText: string;
  avatarColor: string;
  rating: number;
  text: string;
  campaignType: string;
}

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Rian Hidayat',
      role: 'Regional Marketing Manager',
      company: 'Yamaha Tjahaja Baru',
      avatarText: 'RH',
      avatarColor: '#e10613',
      rating: 5,
      text: 'Bekerja sama dengan Kreasi Advertising untuk peluncuran unit motor terbaru kami sangat memuaskan. Titik baliho mereka di Sudirman sangat strategis dengan tingkat visibilitas tinggi. Pengerjaan konstruksi kokoh dan pencahayaan sorot LED di malam hari sangat mumpuni.',
      campaignType: 'Baliho Raksasa Jln. Sudirman'
    },
    {
      id: 2,
      name: 'Sari Anggraini',
      role: 'Store Owner',
      company: 'Miss Glam Bukittinggi',
      avatarText: 'SA',
      avatarColor: '#ec4899',
      rating: 5,
      text: 'Sangat terbantu dengan layanan pembuatan Neon Box dan papan reklame toko dari tim Kreasi. Hasil cetak berketahanan tinggi, warna cerah, dan tahan cuaca ekstrem Bukittinggi yang sering hujan. Komunikasi tim sangat responsif dan pengurusan izin pajak daerah diselesaikan bersih tanpa hambatan.',
      campaignType: 'Neon Box & Facade Toko'
    },
    {
      id: 3,
      name: 'Drs. H. Erman S.',
      role: 'Kepala Bagian Hubungan Masyarakat',
      company: 'Pemkab Agam',
      avatarText: 'ES',
      avatarColor: '#10b981',
      rating: 5,
      text: 'Kami menggunakan jasa Kreasi Advertising untuk sosialisasi program pemerintah daerah melalui spanduk & baliho edukasi di jalan lintas Sumatera. Pelayanan prima, pemasangan rapi, serta pelaporan dokumentasi titik iklan yang sangat lengkap dan akuntabel.',
      campaignType: 'Baliho Edukasi Layanan Masyarakat'
    },
    {
      id: 4,
      name: 'Faisal Tanjung',
      role: 'Founder & Owner',
      company: 'Sudut Kopi Bukittinggi',
      avatarText: 'FT',
      avatarColor: '#8b5cf6',
      rating: 5,
      text: 'Branding kafe baru kami jadi jauh lebih cepat dikenal berkat rekomendasi titik baliho strategis dekat pusat keramaian Jam Gadang. Harga sewa yang all-inclusive sangat bersahabat bagi pelaku UMKM berkembang seperti kami. Sangat direkomendasikan!',
      campaignType: 'Baliho Promosi Kuliner Premium'
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  return (
    <section className="bg-white dark:bg-[#090e21] py-20 border-t border-slate-200 dark:border-white/10" id="testimonials-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="text-center space-y-3" id="testimonials-header">
          <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
            KREASI_TESTIMONI
          </span>
          <h2 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tighter text-slate-950 dark:text-white">
            KATA MITRA KAMI
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Kepercayaan dari berbagai pelaku bisnis lokal hingga instansi pemerintahan adalah bukti nyata dedikasi dan kualitas konstruksi periklanan kami.
          </p>
        </div>

        {/* Carousel Layout */}
        <div className="max-w-4xl mx-auto relative px-2 sm:px-8" id="testimonials-carousel-wrapper">
          
          <div className="bg-slate-50 dark:bg-[#0c1226] border-2 border-slate-200 dark:border-white/5 p-6 sm:p-12 relative overflow-hidden" id="testimonial-main-box">
            {/* Top quote icon deco */}
            <Quote className="absolute -top-4 -right-4 w-32 h-32 text-slate-100 dark:text-white/2 pointer-events-none transform rotate-12" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 relative z-10"
                id={`testimonial-active-slide-${current.id}`}
              >
                {/* Rating Stars */}
                <div className="flex gap-1 text-amber-500" id="testimonial-rating-container">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                {/* Main Quote Text */}
                <blockquote className="text-sm sm:text-lg text-slate-950 dark:text-neutral-200 font-medium leading-relaxed italic uppercase font-mono tracking-tight">
                  "{current.text}"
                </blockquote>

                {/* Profile Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-white/5 pt-6">
                  <div className="flex items-center gap-4">
                    {/* Minimal Monogram Avatar */}
                    <div 
                      style={{ backgroundColor: current.avatarColor }}
                      className="w-12 h-12 flex items-center justify-center font-mono font-black text-sm text-white shadow-md border border-white/10"
                    >
                      {current.avatarText}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-950 dark:text-white font-mono uppercase tracking-tight">
                        {current.name}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        {current.role}, <span className="font-bold text-slate-700 dark:text-slate-300">{current.company}</span>
                      </p>
                    </div>
                  </div>

                  {/* Campaign Tag */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-brand/5 border border-brand/10 dark:bg-brand-secondary/5 dark:border-brand-secondary/10 px-3 py-1 text-[9px] font-mono font-black uppercase text-brand dark:text-brand-secondary tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      {current.campaignType}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav Controls */}
          <div className="flex justify-between items-center mt-6" id="testimonial-carousel-controls">
            {/* Pagination Dots */}
            <div className="flex gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 transition-all duration-300 rounded-none cursor-pointer ${
                    activeIndex === idx ? 'w-8 bg-brand dark:bg-brand-secondary' : 'w-2 bg-slate-300 dark:bg-white/10 hover:bg-slate-400'
                  }`}
                  id={`testimonial-dot-${idx}`}
                  aria-label={`Lihat testimoni ke-${idx + 1}`}
                />
              ))}
            </div>

            {/* Left/Right Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 border border-slate-250 dark:border-white/10 hover:border-brand dark:hover:border-brand-secondary text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center cursor-pointer rounded-none transition-all duration-300"
                id="testimonial-prev-btn"
                aria-label="Testimoni Sebelumnya"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 border border-slate-250 dark:border-white/10 hover:border-brand dark:hover:border-brand-secondary text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center cursor-pointer rounded-none transition-all duration-300"
                id="testimonial-next-btn"
                aria-label="Testimoni Berikutnya"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
