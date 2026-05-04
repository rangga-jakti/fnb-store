'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@warungku.com'
export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const count = useCartStore((state) => state.getCount())
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }
  const isAdmin = user?.email === ADMIN_EMAIL
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E0D5]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E85D26] flex items-center justify-center">
            <span className="text-white text-xs font-bold">W</span>
          </div>
          <span className="font-bold text-[#1A1208] text-lg">WarungKu</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm text-[#8C7B6B] hover:text-[#1A1208] transition-colors font-medium">Menu</Link>
          <Link href="/orders" className="text-sm text-[#8C7B6B] hover:text-[#1A1208] transition-colors font-medium">Pesanan</Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm text-[#E85D26] hover:text-[#C44D1E] transition-colors font-semibold">Admin</Link>
          )}
          <Link href="/cart" className="relative text-sm text-[#8C7B6B] hover:text-[#1A1208] transition-colors font-medium">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 w-4 h-4 bg-[#E85D26] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#8C7B6B] font-mono">{user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="text-sm text-[#E85D26] hover:text-[#C44D1E] font-medium transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-[#8C7B6B] hover:text-[#1A1208] font-medium transition-colors">Login</Link>
              <Link href="/register" className="btn-primary text-sm px-4 py-2 rounded-full font-medium">Daftar</Link>
            </div>
          )}
        </div>
        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={"block w-6 h-0.5 bg-[#1A1208] transition-all duration-300 " + (menuOpen ? "rotate-45 translate-y-2" : "")} />
          <span className={"block w-6 h-0.5 bg-[#1A1208] transition-all duration-300 " + (menuOpen ? "opacity-0" : "")} />
          <span className={"block w-6 h-0.5 bg-[#1A1208] transition-all duration-300 " + (menuOpen ? "-rotate-45 -translate-y-2" : "")} />
        </button>
      </div>
      <div className={"md:hidden transition-all duration-300 overflow-hidden " + (menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0")}>
        <div className="bg-white border-t border-[#E8E0D5] px-6 py-4 flex flex-col gap-4">
          <Link href="/products" className="text-sm font-medium text-[#8C7B6B]" onClick={() => setMenuOpen(false)}>Menu</Link>
          <Link href="/orders" className="text-sm font-medium text-[#8C7B6B]" onClick={() => setMenuOpen(false)}>Pesanan</Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm font-semibold text-[#E85D26]" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          <Link href="/cart" className="text-sm font-medium text-[#8C7B6B]" onClick={() => setMenuOpen(false)}>Cart {count > 0 && "(" + count + ")"}</Link>
          {user ? (
            <button onClick={handleLogout} className="text-sm text-[#E85D26] font-medium text-left">Logout</button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[#8C7B6B]" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="text-sm font-medium text-[#E85D26]" onClick={() => setMenuOpen(false)}>Daftar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}