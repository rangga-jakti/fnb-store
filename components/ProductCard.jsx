'use client'
import { useCartStore } from '@/lib/store'
import { useState } from 'react'
export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  return (
    <div className="card overflow-hidden group">
      <div className="aspect-[4/3] overflow-hidden bg-[#F8F5F0]">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#1A1208] leading-tight">{product.name}</h3>
          <span className="text-xs font-mono text-[#E85D26] bg-[#E85D26]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
            {product.category}
          </span>
        </div>
        <p className="text-xs text-[#8C7B6B] leading-relaxed mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#1A1208]">{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white'
                : 'btn-primary'
            }`}
          >
            {added ? '✓ Ditambah' : '+ Keranjang'}
          </button>
        </div>
      </div>
    </div>
  )
}
