import { defineType, defineField } from "sanity";
import { BlockElementIcon } from "@sanity/icons";

export const newsletterSettings = defineType({
  name: "newsletterSettings",
  title: "Newsletter CTA",
  type: "document",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      initialValue: "Stay Informed",
    }),
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (R) => R.required(),
      initialValue: "Join the Inner Circle",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      initialValue:
        "Be the first to know about new arrivals, exclusive offers, and curated stories.",
    }),
    defineField({
      name: "emailPlaceholder",
      title: "Email Placeholder",
      type: "string",
      initialValue: "Your email address",
    }),
    defineField({
      name: "buttonLabel",
      title: "Button Label",
      type: "string",
      initialValue: "Subscribe",
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "string",
      initialValue: "Thank you for subscribing!",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Newsletter CTA" }),
  },
});
