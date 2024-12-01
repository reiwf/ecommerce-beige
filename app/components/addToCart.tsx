import { Product } from '@/sanity/types'

interface AddToCartProps {
    product: Product;
    disabled: boolean;
}


function handleAddToCart({ product, disabled }: AddToCartProps) {
    if (!product || !selectedColor || !selectedSize) return
    
    const availableQuantity = getAvailableQuantity()
    if (quantity > availableQuantity) {
      alert('Selected quantity exceeds available stock')
      return
    }

    addToCart({
      _id: `${product._id}-${selectedColor}-${selectedSize}`,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: currentImage,
      options: {
        variant: selectedColor,
        size: selectedSize
      }
    })
  }