import { cacheTag } from "next/cache";
import { MenuGetBySlugDocument, type MenuGetBySlugQuery } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import {
	applyCacheProfile,
	FOOTER_MENU_SLUG,
	NAVBAR_MENU_SLUG,
	STOREFRONT_MENU_SLUGS,
	type StorefrontMenuSlug,
} from "@/lib/cache-manifest";

export type MenuItem = NonNullable<NonNullable<NonNullable<MenuGetBySlugQuery["menu"]>["items"]>[number]>;

/** Bump when menu seed/data changes to avoid stale empty "use cache" entries. */
const MENU_CACHE_GENERATION = "seeded-menus-v1";

async function getCachedMenuItems(
	slug: StorefrontMenuSlug,
	channel: string,
	localeSlug: string,
	cacheGeneration: string,
): Promise<MenuItem[] | null> {
	"use cache";
	applyCacheProfile(STOREFRONT_MENU_SLUGS[slug], { channel });
	cacheTag(`menu-fetch:${slug}:${channel}:${cacheGeneration}`);

	const result = await executePublicGraphQL(MenuGetBySlugDocument, {
		variables: { slug, channel, ...graphqlLanguageCodeVariables(localeSlug) },
	});

	if (!result.ok) {
		console.warn(`[getCachedMenuItems] Failed to fetch menu "${slug}" for ${channel}:`, result.error.message);
		return null;
	}

	return result.data.menu?.items ?? [];
}

export async function getNavbarMenuItems(channel: string, localeSlug: string) {
	return getCachedMenuItems(NAVBAR_MENU_SLUG, channel, localeSlug, MENU_CACHE_GENERATION);
}

export async function getFooterMenuItems(channel: string, localeSlug: string) {
	return getCachedMenuItems(FOOTER_MENU_SLUG, channel, localeSlug, MENU_CACHE_GENERATION);
}
