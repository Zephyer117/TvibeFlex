import { defineType, defineField } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 2 }),
    defineField({ name: "mainImage", title: "Main Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image" }] }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "categories", title: "Categories", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
  preview: {
    select: { title: "title", media: "mainImage", date: "publishedAt" },
    prepare: ({ title, media, date }) => ({
      title,
      media,
      subtitle: date ? new Date(date).toLocaleDateString() : "",
    }),
  },
});
