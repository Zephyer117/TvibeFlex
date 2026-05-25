import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (R) => R.required().email(),
      readOnly: true,
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      readOnly: true,
      initialValue: "homepage",
    }),
  ],
  preview: {
    select: { email: "email", subscribedAt: "subscribedAt" },
    prepare: ({ email, subscribedAt }) => ({
      title: email || "Subscriber",
      subtitle: subscribedAt
        ? new Date(subscribedAt).toLocaleString()
        : "—",
    }),
  },
  orderings: [
    {
      title: "Newest",
      name: "subscribedAtDesc",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
  ],
});
