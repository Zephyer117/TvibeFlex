import { defineType, defineField } from "sanity";
import { SparklesIcon } from "@sanity/icons";

export const homepagePromoBanner = defineType({
  name: "homepagePromoBanner",
  title: "Homepage Promo Banner",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "enabled",
      title: "Show promo banner",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "variant",
      title: "Banner Style",
      type: "string",
      options: {
        list: [
          { title: "Flash Sale", value: "flash_sale" },
          { title: "Featured Products", value: "featured" },
          { title: "Special Offer", value: "offer" },
        ],
        layout: "radio",
      },
      initialValue: "flash_sale",
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      initialValue: "Flash Sale",
    }),
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      validation: (R) => R.required(),
      initialValue: "Up to 40% Off Selected Styles",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "endAt",
      title: "Offer Ends At",
      type: "datetime",
      description: "Optional countdown timer (leave empty to hide timer).",
    }),
    defineField({
      name: "ctaLabel",
      title: "Button Label",
      type: "string",
      initialValue: "Shop the Sale",
    }),
    defineField({
      name: "ctaHref",
      title: "Button Link",
      type: "string",
      initialValue: "/shop",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Optional subtle background behind the promo block.",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (R) => R.max(8),
      description: "Pick products to highlight (flash sale or featured picks).",
    }),
  ],
  preview: {
    select: { title: "title", variant: "variant", enabled: "enabled" },
    prepare: ({ title, variant, enabled }) => ({
      title: title || "Homepage Promo Banner",
      subtitle: `${variant || "offer"} · ${enabled ? "Visible" : "Hidden"}`,
    }),
  },
});
