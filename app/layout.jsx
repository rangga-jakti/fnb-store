import './globals.css'
import Navbar from '@/components/Navbar'
export const metadata = {
  title: 'WarungKu - Makanan Enak, Harga Bersahabat',
  description: 'Pesan makanan dan minuman favoritmu dengan mudah.',
}
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
