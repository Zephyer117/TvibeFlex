import { product } from "./product";
import { category } from "./category";
import { post } from "./post";
import { author } from "./author";
import { order } from "./order";
import { storeUser } from "./storeUser";
import { testimonial } from "./testimonial";
import { homepageStats } from "./homepageStats";
import { newsletterSettings } from "./newsletterSettings";
import { newsletterSubscriber } from "./newsletterSubscriber";
import { footerSettings } from "./footerSettings";
import { homepageHeroBanners } from "./homepageHeroBanners";
import { homepagePromoBanner } from "./homepagePromoBanner";

export const schemaTypes = [
  product,
  category,
  post,
  author,
  storeUser,
  order,
  testimonial,
  homepageStats,
  homepageHeroBanners,
  homepagePromoBanner,
  newsletterSettings,
  newsletterSubscriber,
  footerSettings,
];
