import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getMenuCollections } from "@/lib/collections/menu";

type StorefrontLayoutProps = {
  children: React.ReactNode;
};

export async function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const menuCollections = await getMenuCollections();

  return (
    <>
      <Header menuCollections={menuCollections} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
