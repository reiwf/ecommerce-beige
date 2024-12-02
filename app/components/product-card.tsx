'use client'
import Image from 'next/image'
import Link from 'next/link'
import { imageUrl } from '@/sanity/lib/imageUrl';
import { useCart } from '@/app/components/cart-context';

export type ProductTypeCard = {
  name: string;
  price: number;
  categories?: any;
  image?: any;
  stock?: number;
  slug?: { current: string };
  category?: string;
  _id?: string;
};
export function ProductCard  ({ product }: {product : ProductTypeCard})  {
  const { addToCart } = useCart()
  const { name, price , categories , image , _id } = product;
  // const handleAddToCart = () => {
  //   addToCart({ _id: _id || '', name, price, quantity: 1, imageUrl: imageUrl(image).url()})
  // }

  return (
    <div className="bg-beige-100 rounded-lg shadow-md overflow-hidden w-full sm:w-auto">
      <Link href={`/products/${product.slug?.current}`}>
        <Image 
          src={imageUrl(product.image).url()}
          alt={product.name || "Product Image"}
          width={200}
          height={200}
          className="w-full  object-cover mt-2 sm:mt-4 transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div className="p-2 sm:p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-base sm:text-lg font-semibold text-beige-800 mb-1 sm:mb-2 hover:text-beige-700 transition-colors duration-300 line-clamp-1">
            {name}
          </h3>
        </Link>
        <p className="text-sm sm:text-base text-beige-700 font-light mb-2 sm:mb-4">
          JPY {product.price.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

