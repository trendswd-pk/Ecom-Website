import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

type StorefrontLayoutProps = {
  children: React.ReactNode;
};

export function StorefrontLayout({ children }: StorefrontLayoutProps) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
