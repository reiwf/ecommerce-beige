import { client } from "@/sanity/lib/client";
import { ColorVariant , Size } from "@/lib/products";

interface UpdateQuantityProps {
  productId: string;
  size: string;
  quantity: number;
  variant?: string;
}

export async function updateProductQuantity({
  productId,
  size,
  quantity,
  variant
}: UpdateQuantityProps) {
  try {
    // Validate inputs
    if (!productId || !size || !quantity) {
      throw new Error('Missing required parameters for quantity update');
    }

    // Fetch the product with its variants
    const product = await client.fetch(
      `*[_type == "product" && _id == $productId][0]{
        _id,
        name,
        variants
      }`,
      { productId }
    );

    if (!product) {
      throw new Error(`Product not found with ID: ${productId}`);
    }

    if (!product.variants || !Array.isArray(product.variants)) {
      throw new Error(`No variants found for product ${productId}`);
    }

    // Find the variant (if variant is provided) or use the first variant
    const variantToUpdate = variant 
      ? product.variants.find((v: ColorVariant) => v.color.toLowerCase() === variant.toLowerCase())
      : product.variants[0];

    if (!variantToUpdate) {
      throw new Error(`Variant ${variant} not found for product ${productId}`);
    }

    // Find the size in the variant's sizes array
    const sizeIndex = variantToUpdate.sizes.findIndex((s: Size) => 
      s.name.toLowerCase() === size.toLowerCase()
    );

    if (sizeIndex === -1) {
      throw new Error(`Size ${size} not found in variant ${variantToUpdate.color}`);
    }

    // Validate current quantity
    const currentQuantity = variantToUpdate.sizes[sizeIndex].quantity;
    if (typeof currentQuantity !== 'number') {
      throw new Error(`Invalid quantity value for size ${size}`);
    }

    if (currentQuantity < quantity) {
      console.warn(`Warning: Attempting to deduct ${quantity} from current stock of ${currentQuantity}`);
    }

    // Create updated variants array
    const updatedVariants = product.variants.map((v: ColorVariant) => {
      if (v.color === variantToUpdate.color) {
        return {
          ...v,
          sizes: v.sizes.map((s: Size, index: number) => {
            if (index === sizeIndex) {
              const newQuantity = Math.max(0, s.quantity - quantity);
              return {
                ...s,
                quantity: newQuantity
              };
            }
            return s;
          })
        };
      }
      return v;
    });

    // Update the product in Sanity
     await client
      .patch(productId)
      .set({ variants: updatedVariants })
      .commit();

    return { 
      success: true, 
      productId,
      variant: variantToUpdate.color,
      size,
      previousQuantity: currentQuantity,
      newQuantity: Math.max(0, currentQuantity - quantity)
    };

  } catch (error) {
    console.error("Error updating product quantity:", error);
    throw error;
  }
}
