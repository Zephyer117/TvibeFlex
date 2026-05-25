import { defineType, defineField } from "sanity";
import { CommentIcon } from "@sanity/icons";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "user",
      title: "Customer",
      type: "reference",
      to: [{ type: "storeUser" }],
      readOnly: true,
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      readOnly: true,
      description: "Set when the customer submits a comment from a product page.",
    }),
    defineField({
      name: "authorName",
      title: "Display Name",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "authorImageUrl",
      title: "Profile Image URL",
      type: "url",
    }),
    defineField({
      name: "message",
      title: "Review / Comment",
      type: "text",
      rows: 4,
      validation: (R) => R.required().min(10).max(1000),
    }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      validation: (R) => R.min(1).max(5).integer(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending review", value: "pending" },
          { title: "Approved (visible on site)", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
      description: "Highlight this review in the featured testimonials section.",
    }),
  ],
  preview: {
    select: {
      authorName: "authorName",
      message: "message",
      rating: "rating",
      status: "status",
      featured: "featured",
      productName: "product.name",
    },
    prepare: ({ authorName, message, rating, status, featured, productName }) => ({
      title: `${authorName}${featured ? " ★" : ""}`,
      subtitle: `${status}${productName ? ` · ${productName}` : ""}${rating ? ` · ${rating}/5` : ""} — ${message?.slice(0, 60) ?? ""}`,
    }),
  },
  orderings: [
    {
      title: "Newest",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
