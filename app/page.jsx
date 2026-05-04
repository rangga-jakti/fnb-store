import Link from 'next/link'
export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1A1208] text-white">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1208]/95 via-[#1A1208]/70 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-28">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#E85D26]/20 border border-[#E85D26]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85D26] animate-pulse" />
              <span className="text-[#E85D26] text-xs font-mono tracking-widest uppercase">Open Now</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Makanan Enak,<br />
              <span className="text-[#E85D26]">Harga Bersahabat</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              Dari nasi goreng spesial sampai minuman segar - semua ada di sini. 
              Pesan sekarang, siap dalam 15 menit.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary px-8 py-4 rounded-full font-semibold text-sm">
                Pesan Sekarang
              </Link>
              <Link href="/products" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
                Lihat Menu
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[#1A1208] mb-8">Kategori Menu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Main Course', emoji: '🍽️', desc: 'Makanan berat' },
            { name: 'Drinks', emoji: '🥤', desc: 'Minuman segar' },
            { name: 'Snacks', emoji: '🍟', desc: 'Cemilan enak' },
            { name: 'All Menu', emoji: '✨', desc: 'Semua menu' },
          ].map((cat) => (
            <Link key={cat.name} href={cat.name === 'All Menu' ? '/products' : `/products?category=${cat.name}`}
              className="card p-6 text-center group cursor-pointer">
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <div className="font-semibold text-[#1A1208] group-hover:text-[#E85D26] transition-colors">{cat.name}</div>
              <div className="text-xs text-[#8C7B6B] mt-1">{cat.desc}</div>
            </Link>
          ))}
        </div>
      </section>
      {/* Features */}
      <section className="bg-white border-t border-[#E8E0D5] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Cepat & Mudah', desc: 'Pesan dalam hitungan detik, tanpa ribet' },
              { icon: '🔒', title: 'Aman & Terpercaya', desc: 'Transaksi aman dengan enkripsi penuh' },
              { icon: '😋', title: 'Selalu Segar', desc: 'Dimasak fresh setiap hari tanpa pengawet' },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#E85D26]/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <div className="font-semibold text-[#1A1208] mb-1">{f.title}</div>
                  <div className="text-sm text-[#8C7B6B] leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
