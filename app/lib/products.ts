export interface GalleryImage {
    _id: string;
    url: string;
  }
  
  export interface Size {
    name: string;
    quantity: number;
  }
  
  export interface ColorVariant {
    color: string;
    imageUrl: string;
    sizes: Size[];
  }
  
  export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    imageUrl: string;
    gallery?: GalleryImage[];
    variants?: ColorVariant[];
    specifications?: string;
  }

  export interface OrderItem {
    _key: string;
    productId: {
      _ref: string;
      _type: "reference";
    };
    name: string;
    quantity: number;
    price: number;
    options?: {
      variant?: string;
      size?: string;
    };
  }
  
  export interface Order {
    _id: string;
    orderId: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
    clerkUserId: string;
    customerDetails?: {
        address: string;
      };
  } 