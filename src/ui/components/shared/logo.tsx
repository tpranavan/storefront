import { brandConfig } from "@/config/brand";

/** Trimmed BOTO wordmark assets in /public (748×135). */
const LOGO_WIDTH = 748;
const LOGO_HEIGHT = 135;

/**
 * Shared Logo Component
 *
 * - /public/logo.png — default (light backgrounds)
 * - /public/logo-dark.png — inverted surfaces (e.g. footer on bg-foreground)
 *
 * @example
 * <Logo className="h-7 w-auto" />
 * <Logo className="h-7 w-auto" inverted />
 */

interface LogoProps {
	className?: string;
	/** Accessible label for the logo */
	ariaLabel?: string;
	/** Light logo for dark/inverted backgrounds (footer) */
	inverted?: boolean;
}

export const Logo = ({ className, ariaLabel = brandConfig.logoAriaLabel, inverted = false }: LogoProps) => {
	const src = inverted ? "/logo-dark.png" : "/logo.png";

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt={ariaLabel}
			width={LOGO_WIDTH}
			height={LOGO_HEIGHT}
			className={`aspect-[748/135] ${className ?? ""}`}
		/>
	);
};
