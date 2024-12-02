'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { client } from '@/sanity/lib/client'
import { productsQuery, categoriesQuery } from '@/sanity/lib/queries'

interface Product {
  _id: string
  name: string
  categories: string[]
  price: number
  imageUrl: string
  slug: string
}

export default function ProductListing() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max:999999 })
  const [sortBy, setSortBy] = useState('featured')
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        client.fetch(productsQuery),
        client.fetch(categoriesQuery)
      ])
      
      console.log('Products:', productsData)
      console.log('Categories:', categoriesData)
      
      setProducts(productsData)
      setFilteredProducts(productsData)
      setCategories(categoriesData.map((cat: { title: string }) => cat.title))
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filterProducts = () => {
      let result = [...products]

      if (selectedCategories.length > 0) {
        result = result.filter(product => 
          product.categories?.some(category => selectedCategories.includes(category))
        )
      }

      result = result.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
      )

      const sortedResult = [...result]
      switch (sortBy) {
        case 'price-low-high':
          sortedResult.sort((a, b) => a.price - b.price)
          break
        case 'price-high-low':
          sortedResult.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          sortedResult.sort((a, b) => b._id.localeCompare(a._id))
          break
      }

      setFilteredProducts(sortedResult)
    }

    filterProducts()
  }, [products, selectedCategories, priceRange, sortBy])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-beige-900 mb-4 sm:mb-8">Product Catalog</h1>
      
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Filters */}
        <aside className="w-full lg:w-1/4 mb-4 lg:mb-0">
          <div className="bg-beige-100 rounded-lg shadow-md p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-beige-900 mb-3 sm:mb-4">Filters</h2>
            <div className="mb-3 sm:mb-4">
              <h3 className="font-semibold text-beige-800 mb-2">Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={category} className="ml-2 text-sm sm:text-base text-beige-700">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-beige-700 mb-2 sm:mb-0">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card bg-beige-100 rounded-lg shadow-md overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full  object-cover product-image"
                  />
                </Link>                
                <div className="p-2 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-beige-800 mb-1 sm:mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm sm:text-base text-beige-800 font-light">
                    JPY {product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <p className="text-center text-beige-700 mt-4 sm:mt-8">
              No products match your current filters.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
