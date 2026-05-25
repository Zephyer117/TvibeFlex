import { getAllProducts, getAllCategories } from "@/lib/queries";
import ShopClient from "./ShopClient";

export const metadata = { title: "Shop" };
export const revalidate = 60;

interface PageProps {
  searchParams: { category?: string; sort?: string; q?: string };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const [allProducts, categories] = await Promise.all([
    getAllProducts().catch(() => []),
    getAllCategories().catch(() => []),
  ]);

  return (
    <ShopClient
      allProducts={allProducts}
      categories={categories}
      initialCategory={searchParams.category}
      initialSort={searchParams.sort}
      initialQuery={searchParams.q}
    />
  );
}
