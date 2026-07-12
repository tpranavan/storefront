import { type ReactNode, Suspense } from "react";
import { StorefrontProviders } from "@/ui/components/storefront-providers";
import { CartDrawerSlot } from "./browse-chrome-slots";
import { MainChrome } from "./main-chrome";

// Title default + template live in [locale]/layout.tsx (rootMetadata) — do not duplicate
// here or the homepage resolves as "BOTO | BOTO".

type LayoutProps = {
	children: ReactNode;
	params: Promise<{ locale: string; channel: string }>;
};

export default function RootLayout({ children, params }: LayoutProps) {
	return (
		<StorefrontProviders>
			<MainChrome params={params}>{children}</MainChrome>
			<Suspense fallback={null}>
				<CartDrawerSlot params={params} />
			</Suspense>
		</StorefrontProviders>
	);
}
