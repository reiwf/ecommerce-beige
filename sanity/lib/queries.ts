import {defineQuery} from "next-sanity";

export const PRODUCT_QUERY = defineQuery(
    `*[_type == "product" && defined(slug.current)]{
    _id,
        name,
        slug,
        category,
        description,
        image,
        price,
}`
);

export const PRODUCT_BY_ID_QUERY = defineQuery(`
  *[_type == "product" && _id match $id + "*"][0] {
    _id,
    name,
    price,
    currency,
    variants[]{
      color,
      "imageUrl": image.asset->url,
      sizes[]{
        name,
        quantity
      }
    }
  }
`);

export const productsQuery = `*[_type == "product"] {
  _id,
  name,
  "categories": categories[]->title,
  price,
  description,
  "imageUrl": image.asset->url,
  "slug": slug.current,
  currency,
  "gallery": gallery[].asset->{
    _id,
    url
  },
  colors[]{
    color,
    "imageUrl": image.asset->url
  },
  sizes[]{
    name,
    quantity
  },
  "variants": variants[]{
    name,
    "imageUrl": image.asset->url
  }
}`;

export const categoriesQuery = `*[_type == "category"] {
  _id,
  title
}`;

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    description,
    price,
    currency,
    "imageUrl": image.asset->url,
    "categories": categories[]->title,
    "gallery": imageGallery[]{
      "url": asset->url,
      "_id": asset->_id
    },
    variants[]{
      color,
      "imageUrl": image.asset->url,
      sizes[]{
        name,
        quantity
      }
    }
  }
`);

export const PRODUCT_FOR_CART_QUERY = defineQuery(`
  *[_type == "product" && _id == $productId][0] {
    _id,
    name,
    price,
    currency,
      "imageUrl": image.asset->url,
    "categories": categories[]->title,
    "gallery": imageGallery[]{
      "url": asset->url,
      "_id": asset->_id
    },
    variants[]{
      color,
      "imageUrl": image.asset->url,
      sizes[]{
        name,
        quantity
      }
    }
  }
`);

export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && _id in $productIds]{
    _id,
    name,
    price,
    image,
    currency,
    variants[]{
      color,
      "imageUrl": image.asset->url
    }
  }
`);


