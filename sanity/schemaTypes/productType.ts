import { defineType, defineField, defineArrayMember } from 'sanity';
import { ControlsIcon, TagIcon, TrolleyIcon} from '@sanity/icons'
import { GenerateVariants } from '@/sanity/lib/GenerateVariants';

const productType = defineType({
    name: 'product',
    title: 'Products',
    type: 'document',
    icon: TrolleyIcon,
    groups: [
        {
            name: 'product',
            title: 'Product Information',
        },
        {
            name: 'media',
            title: 'Media',
        },
        {
            name: 'variants',
            title: 'Product Variants',
        },
    ],
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            group: 'product'
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'product',
            options: {
                source: 'name',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            group: 'product',
            type: 'text',
        }),
        defineField({
            name: 'price',
            title: 'Price',
            group: 'product',
            description: 'Value is in smallest fractional unit, ie cents (500 = $5.00)',
            type: 'number',
        }),
        defineField({
            name: 'currency',
            title: 'Currency',
            group: 'product',
            type: 'string',
            initialValue:'JPY',
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            group: 'product',
            type: 'array',
            of:[{
                type:"reference", to :{type:"category"}
            }]
        }),
        defineField({
            name: 'image',
            title: 'Product Image',
            type: 'image',
            group: 'media',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'imageGallery',
            title: 'Image Gallery',
            group: 'media',
            type: 'array',
            options: {
                layout: 'grid',
            },
            of: [
                defineArrayMember({
                    name: 'image',
                    title: 'Images',
                    type: 'image',
                    options: {
                        hotspot: true,
                    },
                }),
            ]
        }),
        defineField({
            name: 'variants',
            title: 'Color Variants',
            group: 'variants',
            type: 'array',
            of: [
                defineArrayMember({
                    name: 'variant',
                    title: 'Color Variant',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'color',
                            title: 'Color Name',
                            type: 'string',
                        }),
                        defineField({
                            name: 'image',
                            title: 'Variant Image',
                            type: 'image',
                            options: {
                                hotspot: true,
                            },
                        }),
                        defineField({
                            name: 'sizes',
                            title: 'Available Sizes',
                            type: 'array',
                            of: [
                                defineArrayMember({
                                    name: 'size',
                                    title: 'Size',
                                    type: 'object',
                                    fields: [
                                        defineField({
                                            name: 'name',
                                            title: 'Size Name',
                                            type: 'string',
                                        }),
                                        defineField({
                                            name: 'quantity',
                                            title: 'Available Quantity',
                                            type: 'number',
                                            initialValue: 0,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'color',
                            media: 'image'
                        },
                    },
                }),
            ],
        }),
    ],
    initialValue: {
        currency: 'JPY',
    }
});

export default productType;