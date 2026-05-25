import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons";

export const storeUser = defineType({
  name: "storeUser",
  title: "Store Customer",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "clerkId",
      title: "Clerk User ID",
      type: "string",
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
    }),
    defineField({
      name: "imageUrl",
      title: "Profile Image URL",
      type: "url",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "fullName", subtitle: "email", media: "imageUrl" },
    prepare: ({ title, subtitle }) => ({
      title: title || subtitle || "Customer",
      subtitle,
    }),
  },
});
