import os
content = '''\'use client\'
import { useEffect, useState } from \'react\'
import { supabase } from \'@/lib/supabase\'
import { useRouter } from \'next/navigation\'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || \'admin@warungku.com\'
export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, done: 0 })
  const formatPrice = (price) => new Intl.NumberFormat(\'id-ID\', { style: \'currency\', currency: \'IDR\', minimumFractionDigits: 0 }).format(price)
  const formatDate = (date) => new Date(date).toLocaleDateString(\'id-ID\', { day: \'numeric\', month: \'long\', year: \'numeric\', hour: \'2-digit\', minute: \'2-digit\' })
  const statusColor = (status) => {
    if (status === \'pending\') return \'bg-yellow-100 text-yellow-700\'
    if (status === \'processing\') return \'bg-blue-100 text-blue-700\'
    if (status === \'done\') return \'bg-green-100 text-green-700\'
    return \'bg-gray-100 text-gray-700\'
  }
  const statusLabel = (status) => {
    if (status === \'pending\') return \'Menunggu\'
    if (status === \'processing\') return \'Diproses\'
    if (status === \'done\') return \'Selesai\'
    return status
  }
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push(\'/login\'); return }
      if (session.user.email !== ADMIN_EMAIL) { router.push(\'/\'); return }
      setAuthorized(true)
      fetchOrders()
    }
    checkAuth()
  }, [])
  const fetchOrders = async () => {
    const { data } = await supabase
      .from(\'orders\')
      .select(\'*, order_items(*, products(name, image_url))\')
      .order(\'created_at\', { ascending: false })
    const orders = data || []
    setOrders(orders)
    setStats({
      total: orders.reduce((acc, o) => acc + o.total, 0),
      pending: orders.filter((o) => o.status === \'pending\').length,
      processing: orders.filter((o) => o.status === \'processing\').length,
      done: orders.filter((o) => o.status === \'done\').length,
    })
    setLoading(false)
  }
  const updateStatus = async (id, status) => {
    await supabase.from(\'orders\').update({ status }).eq(\'id\', id)
    fetchOrders()
  }
  if (!authorized || loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-[#8C7B6B]">Loading...</div></div>
  }
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1208]">Admin Dashboard</h1>
          <p className="text-[#8C7B6B] text-sm mt-1">Kelola semua pesanan masuk</p>
        </div>
        <button
          onClick={() => router.push(\'/admin/products\')}
          className="btn-primary text-sm px-5 py-2 rounded-full font-medium"
        >
          Kelola Menu
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: \'Total Revenue\', value: formatPrice(stats.total), color: \'text-[#E85D26]\' },
          { label: \'Menunggu\', value: stats.pending, color: \'text-yellow-600\' },
          { label: \'Diproses\', value: stats.processing, color: \'text-blue-600\' },
          { label: \'Selesai\', value: stats.done, color: \'text-green-600\' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E8E0D5] p-4">
            <div className={"text-2xl font-bold " + s.color}>{s.value}</div>
            <div className="text-xs text-[#8C7B6B] mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E0D5]">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-semibold text-[#1A1208]">Belum ada pesanan</h3>
          </div>
        ) : orders.map((order) => (
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
              <span className="font-bold text-[#E85D26]">{formatPrice(order.total)}</span>
              <div className="flex gap-2">
                {order.status === \'pending\' && (
                  <button onClick={() => updateStatus(order.id, \'processing\')}
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium hover:bg-blue-600 transition-colors">
                    Proses
                  </button>
                )}
                {order.status === \'processing\' && (
                  <button onClick={() => updateStatus(order.id, \'done\')}
                    className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-full font-medium hover:bg-green-600 transition-colors">
                    Selesai
                  </button>
                )}
                {order.status === \'done\' && (
                  <span className="text-xs text-green-600 font-medium">✓ Pesanan selesai</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}'''
with open('app/admin/page.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
