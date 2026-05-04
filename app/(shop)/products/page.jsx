'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
const categories = ['All', 'Main Course', 'Drinks', 'Snacks']
export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').order('created_at')
      setProducts(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])
  useEffect(() => {
    let result = products
    if (activeCategory !== 'All') result = result.filter((p) => p.category === activeCategory)
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [activeCategory, search, products])
  const btnClass = (cat) => cat === activeCategory
    ? 'px-5 py-2.5 rounded-full text-sm font-medium bg-[#E85D26] text-white'
    : 'px-5 py-2.5 rounded-full text-sm font-medium bg-white border border-[#E8E0D5] text-[#8C7B6B] hover:border-[#E85D26] hover:text-[#E85D26]'
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1208] mb-2">Menu Kami</h1>
        <p className="text-[#8C7B6B]">Pilih makanan dan minuman favoritmu</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-[#E8E0D5] rounded-full px-5 py-3 text-sm bg-white"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={btnClass(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-[#E8E0D5]" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#E8E0D5] rounded w-3/4" />
                <div className="h-3 bg-[#E8E0D5] rounded w-full" />
                <div className="h-3 bg-[#E8E0D5] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="font-semibold text-[#1A1208] mb-2">Menu tidak ditemukan</h3>
          <p className="text-[#8C7B6B] text-sm">Coba kata kunci lain atau pilih kategori berbeda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}