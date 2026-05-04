'use client'
import { useCartStore } from '@/lib/store'
export default function CartItem({ item }) {
  const { removeItem, updateQty } = useCartStore()
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  return (
    <div className="flex gap-4 items-center p-4 bg-white rounded-2xl border border-[#E8E0D5]">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F8F5F0] flex-shrink-0">
        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[#1A1208] truncate">{item.name}</h3>
        <p className="text-xs text-[#8C7B6B] mt-0.5">{item.category}</p>
        <p className="text-sm font-bold text-[#E85D26] mt-1">{formatPrice(item.price)}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button onClick={() => removeItem(item.id)} className="text-xs text-[#8C7B6B] hover:text-red-500 transition-colors">
          Hapus
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQty(item.id, item.qty - 1)}
            className="w-7 h-7 rounded-full border border-[#E8E0D5] flex items-center justify-center text-sm font-bold hover:border-[#E85D26] hover:text-[#E85D26] transition-colors"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
          <button
            onClick={() => updateQty(item.id, item.qty + 1)}
            className="w-7 h-7 rounded-full border border-[#E8E0D5] flex items-center justify-center text-sm font-bold hover:border-[#E85D26] hover:text-[#E85D26] transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
