'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import { Star, Truck, ArrowLeft, ArrowBigLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/app/components/cart-context'
import { client } from '@/sanity/lib/client'
import { PRODUCT_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import Link from 'next/link'
import { Product , Size, ColorVariant } from '@/lib/products'


export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [currentImage, setCurrentImage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug: resolvedParams.id })
       
        setProduct(data)
        setCurrentImage(data.imageUrl)
        
        // Initialize first color variant if available
        if (data.variants?.length > 0) {
          const firstVariant = data.variants[0]
          setSelectedColor(firstVariant.color)
          if (firstVariant.sizes?.length > 0) {
            setSelectedSize(firstVariant.sizes[0].name)
          }
          if (firstVariant.imageUrl) {
            setCurrentImage(firstVariant.imageUrl)
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [resolvedParams.id])

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getSelectedVariant = () => {
    if (!selectedColor || !product?.variants) return null
    return product.variants.find(v => v.color === selectedColor)
  }

  const getAvailableSizes = () => {
    const variant = getSelectedVariant()
    return variant?.sizes || []
  }

  const getAvailableQuantity = () => {
    if (!selectedSize || !selectedColor) return 0
    const variant = getSelectedVariant()
    return variant?.sizes.find(s => s.name === selectedSize)?.quantity || 0
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    setSelectedSize('') // Reset size when color changes
    const variant = product?.variants?.find(v => v.color === color)
    if (variant?.imageUrl) {
      setCurrentImage(variant.imageUrl)
    }
  }


  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) return;
    
    const availableQuantity = getAvailableQuantity();
    if (quantity > availableQuantity) {
      alert('Selected quantity exceeds available stock');
      return;
    }

    const selectedVariant = getSelectedVariant();
    if (!selectedVariant) return;

    // Find the selected size object
    const selectedSizeObj = selectedVariant.sizes.find(s => s.name === selectedSize);
    if (!selectedSizeObj) return;

    addToCart({
      product: product,
      quantity: quantity,
      imageUrl: selectedVariant.imageUrl,
      gallery: product.gallery,
      variants: [selectedVariant],  // Only include the selected variant
      sizes: [selectedSizeObj]     // Only include the selected size
    });
  };

  if (isLoading || !product) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Static Back Button */}
      <Button variant="ghost" className="mb-2 sm:mb-4 -ml-2">
        <Link href="/products" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" /> 
          <span className="text-sm sm:text-base">Back to Products</span>
        </Link>
      </Button>

      {/* Floating Back Button */}
      <div className={`fixed left-0 top-[60px]   backdrop-blur-sm z-40 transform transition-all duration-300 ${
        isScrolled ? 'translate-y-0 shadow-md' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-3 sm:px-4 py-2">
          <Button variant="ghost" size="sm" className="flex items-center text-beige-800">
            <Link href="/products" className="flex items-center">
              <ArrowBigLeft className="h-5 w-5 mr-1" /> 
              
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {/* Product Images */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative aspect-square w-full">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div 
              className="cursor-pointer aspect-square relative"
              onClick={() => setCurrentImage(product.imageUrl)}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            {product.gallery?.map((img) => (
              <div 
                key={img._id}
                className="cursor-pointer aspect-square relative"
                onClick={() => setCurrentImage(img.url)}
              >
                <Image
                  src={img.url}
                  alt={`${product.name} gallery image`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 md:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-beige-900 mb-2 sm:mb-4">{product.name}</h1>

          <p className="text-xl sm:text-2xl font-bold text-beige-900 mb-3 sm:mb-4">
            {product.currency} {product.price.toFixed(0)}
          </p>

          <Tabs defaultValue="description" className="mb-4 sm:mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-2 sm:mt-4">
              <p className="text-sm sm:text-base text-beige-700">{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="mt-2 sm:mt-4">
              <p className="text-sm sm:text-base text-beige-700">{product.specifications}</p>
            </TabsContent>            
          </Tabs>

          <div className="flex items-center mb-4 sm:mb-6">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-beige-600 mr-2" />
            <span className="text-sm sm:text-base text-beige-600">Free shipping on orders over ¥10000</span>
          </div>

          {/* Color Selection */}
          {product?.variants && product.variants.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base text-beige-700 mb-2">Color</label>
              <div className="grid grid-cols-4 gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => handleColorChange(variant.color)}
                    className={`p-1 sm:p-2 border rounded-md ${
                      selectedColor === variant.color 
                        ? 'border-primary bg-primary/10' 
                        : 'border-beige-300'
                    }`}
                  >
                    <div className="relative w-full aspect-square mb-1 sm:mb-2">
                      <Image
                        src={variant.imageUrl}
                        alt={variant.color}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <span className="block text-xs sm:text-sm text-center">{variant.color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {selectedColor && (
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base text-beige-700 mb-2">Size</label>
              <div className="grid grid-cols-4 gap-2">
                {getAvailableSizes().map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    disabled={size.quantity === 0}
                    className={`p-2 border rounded-md ${
                      selectedSize === size.name 
                        ? 'border-primary bg-primary/10' 
                        : size.quantity > 0 
                          ? 'border-beige-300' 
                          : 'border-beige-200 opacity-50'
                    }`}
                  >
                    <span className="block text-xs sm:text-sm text-center">
                      {size.name}
                      {size.quantity === 0 && ' (Out)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm sm:text-base text-beige-700 mb-2">Quantity</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={getAvailableQuantity()}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(parseInt(e.target.value), getAvailableQuantity()))}
                className="w-20 p-2 border border-beige-300 rounded-md text-sm sm:text-base"
              />
              <p className="text-xs sm:text-sm text-beige-600">
                Available: {getAvailableQuantity()}
              </p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-4">
            <Button 
              size="lg" 
              className="w-full text-sm sm:text-base py-5 sm:py-6" 
              onClick={handleAddToCart}
              disabled={!selectedColor || !selectedSize || getAvailableQuantity() === 0}
            >
              {!selectedColor || !selectedSize ? 'Select Options' : 
               getAvailableQuantity() === 0 ? 'Out of Stock' : 
               'Add to Cart'}
            </Button>

            {/* <Button 
              variant="outline" 
              size="lg" 
              className="w-full text-sm sm:text-base py-5 sm:py-6"
            >
              Add to Wishlist
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

