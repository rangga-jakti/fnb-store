'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
    const total = getTotal() + 2000
    const { data: order, error } = await supabase
      .from('orders')
      .insert({ user_id: session.user.id, total, status: 'pending' })
      .select()
      .single()
    if (error) { setLoading(false); return }
    await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        qty: item.qty,
        price: item.price,
      }))
    )
    clearCart()
    setSuccess(true)
    setLoading(false)
  }
  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-[#1A1208] mb-2">Pesanan Berhasil!</h2>
        <p className="text-[#8C7B6B] mb-2">Terima kasih sudah memesan di WarungKu.</p>
        <p className="text-[#8C7B6B] text-sm mb-8">Pesananmu sedang diproses dan akan siap dalam 15 menit.</p>
        <Link href="/products" className="btn-primary px-8 py-3 rounded-full font-semibold text-sm inline-block">
          Pesan Lagi
        </Link>
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-[#1A1208] mb-2">Keranjang Kosong</h2>
        <Link href="/products" className="btn-primary px-8 py-3 rounded-full font-semibold text-sm inline-block mt-4">
          Lihat Menu
        </Link>
      </div>
    )
  }
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#1A1208] mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold text-[#1A1208] mb-4">Detail Pengiriman</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Budi Santoso' },
              { id: 'phone', label: 'No. HP', type: 'tel', placeholder: '08xxxxxxxxxx' },
              { id: 'address', label: 'Alamat', type: 'text', placeholder: 'Jl. Contoh No. 1' },
            ].map((field) => (
              <div key={field.id}>
                <label className="text-xs font-semibold text-[#8C7B6B] uppercase tracking-wider block mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  value={form[field.id]}
                  onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                  className="w-full border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm bg-white"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-[#8C7B6B] uppercase tracking-wider block mb-1.5">
                Catatan (opsional)
              </label>
              <textarea
                placeholder="Pedas, tidak pakai bawang, dll..."
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm bg-white resize-none"
              />
            </div>
            <div className="bg-[#F8F5F0] rounded-xl p-4 border border-[#E8E0D5]">
              <h3 className="font-semibold text-sm text-[#1A1208] mb-3">Metode Pembayaran</h3>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-[#E85D26]">
                <div className="w-8 h-8 bg-[#E85D26]/10 rounded-lg flex items-center justify-center text-lg">💵</div>
                <div>
                  <div className="text-sm font-semibold text-[#1A1208]">Cash on Delivery</div>
                  <div className="text-xs text-[#8C7B6B]">Bayar saat pesanan tiba</div>
                </div>
                <div className="ml-auto w-4 h-4 rounded-full bg-[#E85D26] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-full font-semibold text-sm disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Konfirmasi Pesanan'}
            </button>
          </form>
        </div>
        <div>
          <h2 className="font-semibold text-[#1A1208] mb-4">Ringkasan Pesanan</h2>
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-[#1A1208]">{item.name} <span className="text-[#8C7B6B]">x{item.qty}</span></span>
                <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="border-t border-[#E8E0D5] pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8C7B6B]">Subtotal</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8C7B6B]">Biaya layanan</span>
                <span>{formatPrice(2000)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#E85D26]">
                <span>Total</span>
                <span>{formatPrice(getTotal() + 2000)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}