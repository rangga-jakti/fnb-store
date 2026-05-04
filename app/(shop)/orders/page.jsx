'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  const statusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    if (status === 'processing') return 'bg-blue-100 text-blue-700'
    if (status === 'done') return 'bg-green-100 text-green-700'
    return 'bg-gray-100 text-gray-700'
  }
  const statusLabel = (status) => {
    if (status === 'pending') return 'Menunggu'
    if (status === 'processing') return 'Diproses'
    if (status === 'done') return 'Selesai'
    return status
  }
  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, image_url))')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()
  }, [])
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E8E0D5] p-6 h-32" />
          ))}
        </div>
      </div>
    )
  }
  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-[#1A1208] mb-2">Belum Ada Pesanan</h2>
        <p className="text-[#8C7B6B] mb-8">Yuk pesan makanan favoritmu!</p>
        <Link href="/products" className="btn-primary px-8 py-3 rounded-full font-semibold text-sm inline-block">
          Lihat Menu
        </Link>
      </div>
    )
  }
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#1A1208] mb-8">Riwayat Pesanan</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-mono text-[#8C7B6B] mb-1">#{order.id.slice(0, 8).toUpperCase()}</div>
                <div className="text-xs text-[#8C7B6B]">{formatDate(order.created_at)}</div>
              </div>
              <span className={"text-xs font-semibold px-3 py-1 rounded-full " + statusColor(order.status)}>
                {statusLabel(order.status)}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F8F5F0] flex-shrink-0">
                    <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <span className="font-medium text-[#1A1208]">{item.products.name}</span>
                    <span className="text-[#8C7B6B]"> x{item.qty}</span>
                  </div>
                  <div className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8E0D5] pt-3 flex justify-between items-center">
              <span className="text-sm text-[#8C7B6B]">Total</span>
              <span className="font-bold text-[#E85D26]">{formatPrice(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}