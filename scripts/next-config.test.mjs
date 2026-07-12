import { describe, expect, it } from "vitest";

import nextConfig from "../next.config.js";

describe("next.config images", () => {
	it("allows local Saleor API thumbnails in development", () => {
		expect(nextConfig.images?.dangerouslyAllowLocalIP).toBe(process.env.NODE_ENV === "development");
	});

	it("permits Saleor Cloud and local API hostnames", () => {
		const hostnames = nextConfig.images?.remotePatterns?.map((pattern) => pattern.hostname) ?? [];

		expect(hostnames).toContain("*.saleor.cloud");
		expect(hostnames).toContain("*.media.saleor.cloud");
		expect(hostnames).toContain("*");
	});
});
