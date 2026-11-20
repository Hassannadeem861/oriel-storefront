import PageHeader from "@/components/common/PageHeader";
import WishlistView from "@/components/wishlist/WishlistView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Wishlist", path: "/wishlist", noIndex: true });

export default function WishlistPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Wishlist" }]} eyebrow="Saved for later" title="Your wishlist" />
      <div className="container-page pb-24">
        <WishlistView />
      </div>
    </>
  );
}
