import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { HeroCarousel } from '@/components/ui/hero-carousel'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface LiveCategory {
  id: string
  Category: string
  created_at: string
}

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  stock: number
  category_id: string
  is_active: boolean
  created_at: string
  images: string[]
  sale_price: number | null
  seller_id: string
}

async function getLiveCategories(): Promise<{ id: string; name: string }[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, Category, created_at')
    .order('created_at', { ascending: true })

  if (error || !data) return []
  return (data as unknown as LiveCategory[]).map((c) => ({ id: c.id, name: c.Category }))
}

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      seller_id,
      title,
      description,
      price,
      stock,
      category_id,
      is_active,
      created_at,
      product_images (
        id,
        image_path,
        is_main
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error || !data) {
    console.error('Error fetching featured products:', error)
    return []
  }
  
  // Transform products to match frontend expectations
  return (data as any[]).map(product => {
    const rawImages: { id: string; image_path: string; is_main: boolean }[] = Array.isArray(product.product_images) ? product.product_images : []
    const sorted = [...rawImages].sort((a, b) => Number(b.is_main) - Number(a.is_main))
    const productImages = sorted.map((img) => img.image_path).filter(Boolean)
    const toPublic = (p: string) => p?.startsWith('http') || p?.startsWith('/')
      ? p
      : supabase.storage.from('product-images').getPublicUrl(p).data.publicUrl
    const imagesOut = (productImages.length > 0 ? productImages : ['/bamboo-utensils.svg']).map(toPublic)

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      is_active: product.is_active,
      created_at: product.created_at,
      images: imagesOut,
      sale_price: null,
      seller_id: product.seller_id
    }
  })
}

export default async function HomePage() {
  const liveCategories = await getLiveCategories()
  const featuredProducts = await getFeaturedProducts()
  const palette = ['bg-green-50', 'bg-amber-50', 'bg-blue-50', 'bg-purple-50']

  // Fallbacks to avoid an empty-looking homepage when DB has no data
  const fallbackCategories: { id: string; name: string }[] = [
    { id: 'household', name: 'Household' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'stationery', name: 'Stationery' },
  ]

  const fallbackFeatured: Product[] = [
    {
      id: 'demo-1',
      title: 'Organic Cotton T-Shirt',
      description: 'Soft, breathable, and sustainably made.',
      price: 599,
      stock: 100,
      category_id: 'apparel',
      is_active: true,
      created_at: new Date().toISOString(),
      images: ['/tshirt.webp'],
      sale_price: null,
      seller_id: 'demo'
    },
    {
      id: 'demo-2',
      title: 'Bamboo Utensils Set',
      description: 'Reusable cutlery for eco-friendly dining.',
      price: 299,
      stock: 100,
      category_id: 'kitchen',
      is_active: true,
      created_at: new Date().toISOString(),
      images: ['/products/bamboo-utensils.svg'],
      sale_price: null,
      seller_id: 'demo'
    },
    {
      id: 'demo-3',
      title: 'Eco Tote Bag',
      description: 'Durable reusable tote for everyday use.',
      price: 199,
      stock: 100,
      category_id: 'household',
      is_active: true,
      created_at: new Date().toISOString(),
      images: ['/bags.png'],
      sale_price: null,
      seller_id: 'demo'
    }
  ]

  const categoriesToShow = (liveCategories.length > 0 ? liveCategories : fallbackCategories)
  const featuredToShow = (featuredProducts.length > 0 ? featuredProducts : fallbackFeatured)

  return (
    <>
      {/* Hero Section - full screen carousel */}
      <section className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full overflow-hidden">
          <HeroCarousel
            className="absolute inset-0"
            slides={[
              { src: '/a-website-banner-for-an-eco-conscious-li_vs27Cs_QR1aDAT7oKa93Lw_Ag6Y1ErKRn2c8TAgLZHf0A.jpeg', alt: 'Shop Smart, Live Green' },
              { src: '/a-website-banner-for-an-eco-conscious-li_CdhdK6yCSyq1gzTX2jtQ0A_Ag6Y1ErKRn2c8TAgLZHf0A.jpeg', alt: 'Eco-Conscious Lifestyle Banner' },
              { src: '/a-website-banner-for-an-eco-friendly-hom_Xx1zeewXS1yW7gTkylBhTA_2c39gh9OSEyzNu549m-x1A.jpeg', alt: 'Eco-Friendly Home Products' }
            ]}
            priority
          />
        </section>

        {/* Categories Section - Live from database */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4">Shop by Category</h2>
            <p className="text-center text-gray-600 mb-6 md:mb-8 text-sm md:text-base px-4">
              Find exactly what you need in our curated categories
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {categoriesToShow.map((category, idx) => (
                <Link 
                  href={`/products?category=${encodeURIComponent(category.id)}`} 
                  key={category.id}
                  className={`group ${palette[idx % palette.length]} rounded-xl p-6 md:p-8 transition-all duration-200 hover:shadow-lg h-full block`}
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 md:mb-6">Explore our selection of {category.name} products</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Browse</span>
                    <span className="text-[#2B5219] group-hover:translate-x-2 transition-transform duration-200">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products - Live from database */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4">Featured Products</h2>
            <p className="text-center text-gray-600 mb-8 md:mb-12 text-sm md:text-base px-4">
              Handpicked sustainable products for conscious living
            </p>
            
            {featuredToShow.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto mb-8">
                {featuredToShow.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group block">
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[340px] md:h-[380px] overflow-hidden border border-gray-100 cursor-pointer">
                      <div className="relative h-40 md:h-44">
                        <Image
                          src={product.images[0] || '/bamboo-utensils.svg'}
                          alt={product.title}
                          width={300}
                          height={220}
                          className="w-full h-full object-cover bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-[#2B5219] text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm">
                          Eco-Friendly
                        </span>
                        {product.sale_price && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm">
                            Sale
                          </span>
                        )}
                      </div>
                      <div className="p-3 md:p-4 flex flex-col flex-grow">
                        <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2 min-h-[2rem] md:min-h-[2rem]">{product.title}</h3>
                        <p className="text-[11px] md:text-xs text-gray-600 mb-2 md:mb-3 line-clamp-2 flex-grow">
                          {product.description || 'Eco-friendly product for sustainable living'}
                        </p>
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm md:text-base font-bold text-[#2B5219]">
                              ₹{product.sale_price || product.price}
                            </span>
                            {product.sale_price && (
                              <span className="text-xs md:text-sm text-gray-500 line-through">
                                ₹{product.price}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-full">
                            <img src="/globe with no background.png" alt="Earth" className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-[10px] md:text-xs font-medium text-gray-700">Earth rating 4.5</span>
                          </div>
                        </div>
                        {/* Stock hidden as requested */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
            
            <div className="text-center mt-8 md:mt-12">
              <Link href="/products" className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-colors">
                View All Products
              </Link>
            </div>
          </div>
        </section>
    </>
  )
} 