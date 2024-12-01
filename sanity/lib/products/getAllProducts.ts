import {defineQuery} from "next-sanity";
import {sanityFetch} from "@/sanity/lib/live";


export const getAllProducts = async () => {
    const ALL_PRODUCT_QUERY = defineQuery(
        `*[_type == "product"] | order(_createdAt desc)[0...10]`
    );

    try{
        const products = await sanityFetch({
            query: ALL_PRODUCT_QUERY,
        });
        return products.data || [];
    } catch (error) {
        console.error("error", error);
        return[];
    }
};