import { defineType, defineField } from "sanity";
import { formatBdt } from "../lib/format";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (R) => R.required() }),
    defineField({ name: "price", title: "Price (BDT)", type: "number", validation: (R) => R.required().positive() }),
    defineField({ name: "comparePrice", title: "Compare at Price (BDT)", type: "number" }),
    defineField({ name: "description", title: "Short Description", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Full Description", type: "array", of: [{ type: "block" }, { type: "image" }] }),
    defineField({ name: "images", title: "Images", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "category" }] }),
    defineField({ name: "stock", title: "Stock Quantity", type: "number", initialValue: 0 }),
    defineField({ name: "featured", title: "Featured Product", type: "boolean", initialValue: false }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({
      name: "variantOptions",
      title: "Product Variations",
      description: "Optional options such as Size or Color. Shoppers must choose one value per option before adding to cart.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Option Name", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "values",
              title: "Available Values",
              type: "array",
              of: [{ type: "string" }],
              validation: (R) => R.required().min(1),
            }),
          ],
          preview: {
            select: { title: "name", values: "values" },
            prepare: ({ title, values }) => ({
              title,
              subtitle: Array.isArray(values) ? values.join(", ") : "",
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", media: "images.0", price: "price" },
    prepare: ({ title, media, price }) => ({
      title,
      media,
      subtitle: price != null ? formatBdt(price) : "",
    }),
  },
});
