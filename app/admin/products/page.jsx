'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@warungku.com'
const CATEGORIES = ['Main Course', 'Drinks', 'Snacks']
export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '', category: 'Main Course', stock: '' })
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.email !== ADMIN_EMAIL) { router.push('/'); return }
      fetchProducts()
    }
    checkAuth()
  }, [])
  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at')
    setProducts(data || [])
    setLoading(false)
  }
  const resetForm = () => {
    setForm({ name: '', description: '', price: '', image_url: '', category: 'Main Course', stock: '' })
    setEditProduct(null)
    setShowForm(false)
  }
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      stock: product.stock,
    })
    setEditProduct(product)
    setShowForm(true)
  }
  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus produk ini?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = Math.random().toString(36).slice(2) + '.' + fileExt
    const filePath = 'menu/' + fileName
    const { error } = await supabase.storage.from('products').upload(filePath, file)
    if (error) { setUploading(false); alert('Gagal upload foto'); return }
    const { data } = supabase.storage.from('products').getPublicUrl(filePath)
    setForm((prev) => ({ ...prev, image_url: data.publicUrl }))
    setUploading(false)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      description: form.description,
      price: parseInt(form.price),
      image_url: form.image_url,
      category: form.category,
      stock: parseInt(form.stock),
    }
    if (editProduct) {
      await supabase.from('products').update(payload).eq('id', editProduct.id)
    } else {
      await supabase.from('products').insert(payload)
    }
    setSaving(false)
    resetForm()
    fetchProducts()
  }
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-[#8C7B6B]">Loading...</div></div>
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1208]">Kelola Menu</h1>
          <p className="text-[#8C7B6B] text-sm mt-1">{products.length} produk terdaftar</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/admin')} className="text-sm text-[#8C7B6B] border border-[#E8E0D5] px-4 py-2 rounded-full hover:border-[#E85D26] hover:text-[#E85D26] transition-colors">
            Dashboard
          </button>
          <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm px-5 py-2 rounded-full font-medium">
            + Tambah Menu
          </button>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#1A1208] mb-6">{editProduct ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: 'Nama Menu', type: 'text', placeholder: 'Nasi Goreng Spesial' },
                { id: 'description', label: 'Deskripsi', type: 'text', placeholder: 'Deskripsi singkat menu' },
                { id: 'price', label: 'Harga (Rp)', type: 'number', placeholder: '25000' },
                { id: 'stock', label: 'Stok', type: 'number', placeholder: '50' },
              ].map((field) => (
                <div key={field.id}>
                  <label className="text-xs font-semibold text-[#8C7B6B] uppercase tracking-wider block mb-1.5">{field.label}</label>
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
                <label className="text-xs font-semibold text-[#8C7B6B] uppercase tracking-wider block mb-1.5">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm bg-white"
                >
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8C7B6B] uppercase tracking-wider block mb-1.5">Foto Menu</label>
                <div className="border-2 border-dashed border-[#E8E0D5] rounded-xl p-4 text-center hover:border-[#E85D26] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    {uploading ? (
                      <div className="text-sm text-[#8C7B6B]">Mengupload...</div>
                    ) : form.image_url ? (
                      <div>
                        <img src={form.image_url} alt="preview" className="w-full h-40 object-cover rounded-xl mb-2" />
                        <div className="text-xs text-[#E85D26]">Klik untuk ganti foto</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-3xl mb-2">📷</div>
                        <div className="text-sm text-[#8C7B6B]">Klik untuk upload foto</div>
                        <div className="text-xs text-[#8C7B6B] mt-1">JPG, PNG, WebP</div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 border border-[#E8E0D5] text-[#8C7B6B] py-3 rounded-full text-sm font-medium hover:border-red-300 hover:text-red-400 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={saving || uploading || !form.image_url} className="flex-1 btn-primary py-3 rounded-full text-sm font-semibold disabled:opacity-50">
                  {saving ? 'Menyimpan...' : editProduct ? 'Simpan Perubahan' : 'Tambah Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-[#E8E0D5] overflow-hidden flex gap-4 p-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F8F5F0] flex-shrink-0">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-[#1A1208] text-sm leading-tight">{product.name}</h3>
                <span className="text-[10px] font-mono text-[#E85D26] bg-[#E85D26]/10 px-2 py-0.5 rounded-full whitespace-nowrap">{product.category}</span>
              </div>
              <p className="text-xs text-[#8C7B6B] mt-0.5 line-clamp-1">{product.description}</p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <div className="font-bold text-[#E85D26] text-sm">{formatPrice(product.price)}</div>
                  <div className="text-xs text-[#8C7B6B]">Stok: {product.stock}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(product)} className="text-xs border border-[#E8E0D5] text-[#8C7B6B] px-3 py-1.5 rounded-full hover:border-[#E85D26] hover:text-[#E85D26] transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-xs border border-red-200 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}