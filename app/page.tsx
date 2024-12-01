import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard, ProductTypeCard } from '@/app/components/product-card'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { PRODUCT_QUERY } from '@/sanity/lib/queries'



export default async function Home({searchParams,
}: {
searchParams: Promise<{ query?: string }>;
})  {

  const query = (await searchParams).query;
  const params = { search:query || null};

  const { data: products } = await sanityFetch({ query: PRODUCT_QUERY, params});
  
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[600px] rounded-lg overflow-hidden mb-6 sm:mb-12">
        <Image
          src="/hero_Image.jpg"
          alt="Hero Image"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-beige-400 px-4">
          <h1 className="text-beige-50 text-3xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4">
            Becky In Japan
          </h1>
          <p className="text-beige-100 text-lg sm:text-xl md:text-2xl mb-4 sm:mb-8">
            Buy from Japan
          </p>
          <Button size="lg" className="btn-style w-full sm:w-auto max-w-[200px]" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-6 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-beige-800 mb-4 sm:mb-6 px-2">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8">
          {products.map((product: ProductTypeCard) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </section>
      <SanityLive/>
    </div>
    
  )
}

