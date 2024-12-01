import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {orderType} from "@/sanity/schemaTypes/orderType";
import {saleType} from "@/sanity/schemaTypes/saleType";
import productType from "@/sanity/schemaTypes/productType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, orderType, saleType , productType],
}
