import { defineType, defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const homepageHeroBanners = defineType({
  name: "homepageHeroBanners",
  title: "Homepage Hero Slider",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "slides",
      title: "Banner Slides",
      type: "array",
      description:
        "Full-width hero carousel for offers, collections, and announcements. Drag to reorder.",
      of: [
        {
          type: "object",
          name: "heroSlide",
          fields: [
            defineField({
              name: "active",
              title: "Show on site",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "image",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
              validation: (R) => R.required(),
            }),
            defineField({
              name: "eyebrow",
              title: "Eyebrow",
              type: "string",
              description: 'Small label above title, e.g. "Limited Time"',
            }),
            defineField({
              name: "title",
              title: "Headline",
              type: "string",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "ctaLabel",
              title: "Button Label",
              type: "string",
              initialValue: "Shop Now",
            }),
            defineField({
              name: "ctaHref",
              title: "Button Link",
              type: "string",
              description: "e.g. /shop or /shop?tag=sale",
              initialValue: "/shop",
            }),
          ],
          preview: {
            select: { title: "title", media: "image", active: "active" },
            prepare: ({ title, media, active }) => ({
              title: title || "Untitled slide",
              subtitle: active === false ? "Hidden" : "Visible",
              media,
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage Hero Slider" }),
  },
});
