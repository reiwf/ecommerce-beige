import {defineField, defineType} from "sanity";
import {TagIcon} from "@sanity/icons";

export const saleType = defineType({
    name: "sale",
    title: "Sale",
    type: "document",
    icon:TagIcon,
    fields: [
        defineField({
            name:"title",
            title:"Sale Title",
            type:"string",
        }),
        defineField({
            name:"description",
            title:"Sale Description",
            type:"text",
        }),
        defineField({
            name:"discountAmount",
            title:"Discount Amount",
            type:"number",
            description:"Amount off in percentage of fixed value",
        }),
        defineField({
            name:"couponCode",
            title:"Coupon Code",
            type:"string",
        }),
        defineField({
            name:"validFrom",
            title:"Valid From",
            type:"datetime",
        }),
        defineField({
            name:"validUntil",
            title:"Valid Until",
            type:"datetime",
        }),
        defineField({
            name:"isActive",
            title:"Is Active",
            type:"boolean",
            description:"Toggle to active/deactivate the sale",
            initialValue: true,
        }),
    ],
    preview:{
        select:{
            title:"title",
            discountAmount:"discountAmount",
            couponCode:"couponCode",
            isActive:"isActive",
        },
        prepare(selection){
            const {title,discountAmount, couponCode,isActive}=selection;
            const status=isActive? "Active" : "InActive";
            return {
                title,
                subtitle:`${discountAmount}% off - Code:${couponCode} - ${status}`,
            };
        }
    }
});