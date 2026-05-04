import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const products = [
  { name: 'Nasi Goreng Spesial', description: 'Nasi goreng dengan telur, ayam, dan sayuran segar', price: 35000, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80', category: 'Main Course', stock: 50 },
  { name: 'Mie Ayam Bakso', description: 'Mie ayam dengan bakso sapi pilihan dan kuah kaldu', price: 28000, image_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=500&q=80', category: 'Main Course', stock: 50 },
  { name: 'Ayam Geprek', description: 'Ayam crispy geprek dengan sambal bawang pedas', price: 32000, image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80', category: 'Main Course', stock: 50 },
  { name: 'Gado-Gado', description: 'Sayuran segar dengan bumbu kacang khas', price: 25000, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', category: 'Main Course', stock: 50 },
  { name: 'Es Teh Manis', description: 'Teh manis segar dengan es batu', price: 8000, image_url: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&q=80', category: 'Drinks', stock: 100 },
  { name: 'Es Jeruk', description: 'Jeruk peras segar dengan es batu', price: 10000, image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80', category: 'Drinks', stock: 100 },
  { name: 'Jus Alpukat', description: 'Jus alpukat creamy dengan susu dan madu', price: 18000, image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80', category: 'Drinks', stock: 100 },
  { name: 'Pisang Goreng', description: 'Pisang goreng crispy dengan taburan gula halus', price: 15000, image_url: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=500&q=80', category: 'Snacks', stock: 50 },
  { name: 'Tahu Crispy', description: 'Tahu goreng crispy dengan bumbu balado', price: 12000, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', category: 'Snacks', stock: 50 },
  { name: 'Martabak Mini', description: 'Martabak telur mini dengan isian daging cincang', price: 20000, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80', category: 'Snacks', stock: 30 },
]
async function seed() {
  const { error } = await supabase.from('products').insert(products)
  if (error) console.error('Error:', error)
  else console.log('Products inserted!')
}
seed()
