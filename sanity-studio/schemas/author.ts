import { defineType, defineField } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "bio", title: "Bio", type: "string" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
  ],
});
