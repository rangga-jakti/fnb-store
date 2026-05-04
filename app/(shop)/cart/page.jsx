'use client'
import { useCartStore } from '@/lib/store'
import CartItem from '@/components/CartItem'
import Link from 'next/link'
export default function CartPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-[#1A1208] mb-2">Keranjang Kosong</h2>
        <p className="text-[#8C7B6B] mb-8">Yuk tambahkan makanan favoritmu!</p>
        <Link href="/products" className="btn-primary px-8 py-3 rounded-full font-semibold text-sm inline-block">
          Lihat Menu
        </Link>
      </div>
    )
  }
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#1A1208]">Keranjang</h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors">
          Kosongkan
        </button>
      </div>
      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#8C7B6B] text-sm">Subtotal</span>
          <span className="font-semibold">{formatPrice(getTotal())}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#8C7B6B] text-sm">Biaya layanan</span>
          <span className="font-semibold">{formatPrice(2000)}</span>
        </div>
        <div className="border-t border-[#E8E0D5] my-4" />
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-[#1A1208]">Total</span>
          <span className="font-bold text-xl text-[#E85D26]">{formatPrice(getTotal() + 2000)}</span>
        </div>
        <Link href="/checkout" className="btn-primary w-full py-4 rounded-full font-semibold text-sm text-center block">
          Lanjut ke Pembayaran
        </Link>
        <Link href="/products" className="block text-center text-sm text-[#8C7B6B] hover:text-[#1A1208] transition-colors mt-3">
          Tambah Menu Lagi
        </Link>
      </div>
    </div>
  )
}