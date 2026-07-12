import { afterEach, describe, expect, it } from "vitest";
import { normalizeSaleorMediaUrl, resolveProductThumbnailUrl } from "./images";

describe("normalizeSaleorMediaUrl", () => {
	const originalApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;

	afterEach(() => {
		if (originalApiUrl === undefined) {
			delete process.env.NEXT_PUBLIC_SALEOR_API_URL;
		} else {
			process.env.NEXT_PUBLIC_SALEOR_API_URL = originalApiUrl;
		}
	});

	it("rewrites localhost thumbnail URLs to the deployed API origin", () => {
		process.env.NEXT_PUBLIC_SALEOR_API_URL =
			"https://boto-saleor-api-905390756253.us-central1.run.app/graphql/";

		expect(normalizeSaleorMediaUrl("http://localhost:8000/thumbnail/UHJvZHVjdE1lZGlhOjE3/1024/webp/")).toBe(
			"https://boto-saleor-api-905390756253.us-central1.run.app/thumbnail/UHJvZHVjdE1lZGlhOjE3/1024/webp/",
		);
	});

	it("leaves public GCS URLs unchanged", () => {
		process.env.NEXT_PUBLIC_SALEOR_API_URL =
			"https://boto-saleor-api-905390756253.us-central1.run.app/graphql/";

		const gcs =
			"https://storage.googleapis.com/boto-qa-media/thumbnails/products/saleor-ascii-shirt-front_OctinaR_thumbnail_256.png";
		expect(normalizeSaleorMediaUrl(gcs)).toBe(gcs);
	});

	it("returns null for empty input", () => {
		expect(normalizeSaleorMediaUrl(null)).toBeNull();
		expect(normalizeSaleorMediaUrl(undefined)).toBeNull();
	});
});

describe("resolveProductThumbnailUrl", () => {
	const originalApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;

	afterEach(() => {
		if (originalApiUrl === undefined) {
			delete process.env.NEXT_PUBLIC_SALEOR_API_URL;
		} else {
			process.env.NEXT_PUBLIC_SALEOR_API_URL = originalApiUrl;
		}
	});

	it("rewrites stale direct thumbnail paths to the proxy endpoint", () => {
		process.env.NEXT_PUBLIC_SALEOR_API_URL = "http://localhost:8000/graphql/";

		expect(
			resolveProductThumbnailUrl(
				"http://localhost:8000/media/thumbnails/products/saleor-white-plimsolls-1_OPwIT6l_thumbnail_1024.webp",
				"UHJvZHVjdE1lZGlhOjI=",
			),
		).toBe("http://localhost:8000/thumbnail/UHJvZHVjdE1lZGlhOjI=/1024/webp/");
	});

	it("leaves working proxy thumbnail URLs unchanged", () => {
		process.env.NEXT_PUBLIC_SALEOR_API_URL = "http://localhost:8000/graphql/";
		const proxy = "http://localhost:8000/thumbnail/UHJvZHVjdE1lZGlhOjI=/1024/webp/";
		expect(resolveProductThumbnailUrl(proxy, "UHJvZHVjdE1lZGlhOjI=")).toBe(proxy);
	});
});
