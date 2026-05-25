import { defineType, defineField } from "sanity";
import { BarChartIcon } from "@sanity/icons";

export const homepageStats = defineType({
  name: "homepageStats",
  title: "Homepage Stats",
  type: "document",
  icon: BarChartIcon,
  fields: [
    defineField({
      name: "stats",
      title: "Hero Statistics",
      type: "array",
      description:
        "Three stats shown in the homepage hero (e.g. 2,400+ Happy Clients).",
      validation: (R) => R.required().min(3).max(3),
      of: [
        {
          type: "object",
          name: "statItem",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (R) => R.required(),
              description: 'Display value, e.g. "2,400+" or "180+"',
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (R) => R.required(),
              description: 'e.g. "Happy Clients"',
            }),
          ],
          preview: {
            select: { value: "value", label: "label" },
            prepare: ({ value, label }) => ({
              title: value || "—",
              subtitle: label,
            }),
          },
        },
      ],
      initialValue: [
        { value: "2,400+", label: "Happy Clients" },
        { value: "180+", label: "Premium Products" },
        { value: "15+", label: "Years of Craft" },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage Stats" }),
  },
});
