import { defineType, defineField } from "sanity";
import { ComponentIcon } from "@sanity/icons";

const linkItem = {
  type: "object",
  name: "footerLink",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "href",
      title: "URL path",
      type: "string",
      validation: (R) => R.required(),
      description: 'e.g. "/shop" or "/about"',
    }),
  ],
  preview: {
    select: { label: "label", href: "href" },
    prepare: ({ label, href }: { label?: string; href?: string }) => ({
      title: label,
      subtitle: href,
    }),
  },
};

const socialLink = {
  type: "object",
  name: "socialLink",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Twitter / X", value: "twitter" },
          { title: "Facebook", value: "facebook" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "url",
      title: "Profile URL",
      type: "url",
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { platform: "platform", url: "url" },
    prepare: ({ platform, url }: { platform?: string; url?: string }) => ({
      title: platform,
      subtitle: url,
    }),
  },
};

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Footer",
  type: "document",
  icon: ComponentIcon,
  fields: [
    defineField({
      name: "brandHighlight",
      title: "Brand highlight",
      type: "string",
      initialValue: "TVibe",
    }),
    defineField({
      name: "brandName",
      title: "Brand name",
      type: "string",
      initialValue: "Flex",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 3,
      initialValue:
        "Premium products curated for the discerning individual. Crafted with excellence, delivered with care.",
    }),
    defineField({
      name: "shopLinks",
      title: "Shop links",
      type: "array",
      of: [linkItem],
      initialValue: [
        { label: "All Products", href: "/shop" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Journal", href: "/blog" },
      ],
    }),
    defineField({
      name: "infoLinks",
      title: "Info links",
      type: "array",
      of: [linkItem],
      initialValue: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "My Orders", href: "/account/orders" },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [socialLink],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright line",
      type: "string",
      description: "Use {year} for the current year.",
      initialValue: "© {year} TVibeFlex. All rights reserved.",
    }),
    defineField({
      name: "creditLine",
      title: "Credit line",
      type: "string",
      initialValue: "Built with Next.js · Sanity",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Footer" }),
  },
});
