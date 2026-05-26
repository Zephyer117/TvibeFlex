import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "luxe-store-studio",
  title: "TVibeFlex Admin",
  projectId: "3tavxqc3",
  dataset: "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("🏠 Homepage Stats")
              .id("homepageStats")
              .child(
                S.document()
                  .schemaType("homepageStats")
                  .documentId("homepageStats")
                  .title("Homepage Stats")
              ),
            S.listItem()
              .title("🖼 Hero Slider (Offers)")
              .id("homepageHeroBanners")
              .child(
                S.document()
                  .schemaType("homepageHeroBanners")
                  .documentId("homepageHeroBanners")
                  .title("Hero Slider")
              ),
            S.listItem()
              .title("⚡ Promo Banner (Flash / Featured)")
              .id("homepagePromoBanner")
              .child(
                S.document()
                  .schemaType("homepagePromoBanner")
                  .documentId("homepagePromoBanner")
                  .title("Promo Banner")
              ),
            S.listItem()
              .title("✉️ Newsletter CTA")
              .id("newsletterSettings")
              .child(
                S.document()
                  .schemaType("newsletterSettings")
                  .documentId("newsletterSettings")
                  .title("Newsletter CTA")
              ),
            S.listItem()
              .title("📧 Newsletter Subscribers")
              .schemaType("newsletterSubscriber")
              .child(
                S.documentTypeList("newsletterSubscriber").title("Subscribers")
              ),
            S.listItem()
              .title("🦶 Footer")
              .id("footerSettings")
              .child(
                S.document()
                  .schemaType("footerSettings")
                  .documentId("footerSettings")
                  .title("Footer")
              ),
            S.divider(),
            S.listItem().title("🛒 Orders").schemaType("order").child(
              S.documentTypeList("order").title("Orders")
            ),
            S.listItem().title("👤 Customers").schemaType("storeUser").child(
              S.documentTypeList("storeUser").title("Store Customers")
            ),
            S.listItem().title("💬 Testimonials").schemaType("testimonial").child(
              S.documentTypeList("testimonial").title("Testimonials")
            ),
            S.divider(),
            S.listItem().title("📦 Products").schemaType("product").child(
              S.documentTypeList("product").title("Products")
            ),
            S.listItem().title("🗂 Categories").schemaType("category").child(
              S.documentTypeList("category").title("Categories")
            ),
            S.divider(),
            S.listItem().title("📝 Blog Posts").schemaType("post").child(
              S.documentTypeList("post").title("Posts")
            ),
            S.listItem().title("✍️ Authors").schemaType("author").child(
              S.documentTypeList("author").title("Authors")
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
