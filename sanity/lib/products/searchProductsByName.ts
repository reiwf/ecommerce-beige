import {defineQuery} from "next-sanity";
import {sanityFetch} from "@/sanity/lib/live";

export const searchProductsByName = async (searchParam:string) => {
    const PRODUCT_SEARCH_QUERY = defineQuery(`
    *[
    _type == "product"
    && name match $searchParam || category match $searchParam {
    _id, 
  name, 
  slug,
  _createdAt,  
  description,
  category,
  image,
}
    ]
    `);

    try {
        const products = await sanityFetch({
            query: PRODUCT_SEARCH_QUERY,
            params:{
                searchParam:`${searchParam}`,
            },
            });

    return products.data ||[];
    } catch (error) {
            console.error("error fetching products by name:",error);
        return [];
    }
};

