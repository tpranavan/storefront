import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const sizes = [
	{ name: "favicon-16x16.png", size: 16, src: "logo.png", bg: "#ffffff" },
	{ name: "favicon-32x32.png", size: 32, src: "logo.png", bg: "#ffffff" },
	{ name: "favicon-dark-16x16.png", size: 16, src: "logo-dark.png", bg: "#111111" },
	{ name: "favicon-dark-32x32.png", size: 32, src: "logo-dark.png", bg: "#111111" },
	{ name: "apple-icon.png", size: 180, src: "logo.png", bg: "#ffffff" },
	{ name: "android-chrome-192x192.png", size: 192, src: "logo.png", bg: "#ffffff" },
	{ name: "android-chrome-512x512.png", size: 512, src: "logo.png", bg: "#ffffff" },
];

const pad = (size) => Math.max(2, Math.round(size * 0.12));

async function renderIcon({ name, size, src, bg }) {
	const inset = pad(size);
	const logo = await sharp(path.join(publicDir, src))
		.resize(size - inset * 2, size - inset * 2, { fit: "inside" })
		.png()
		.toBuffer();

	await sharp({
		create: {
			width: size,
			height: size,
			channels: 4,
			background: bg,
		},
	})
		.composite([{ input: logo, gravity: "centre" }])
		.png()
		.toFile(path.join(publicDir, name));

	console.log(`wrote ${name}`);
}

async function renderFaviconIco() {
	const png32 = await sharp(path.join(publicDir, "favicon-32x32.png")).png().toBuffer();
	await writeFile(path.join(publicDir, "favicon.ico"), png32);
	console.log("wrote favicon.ico");
}

for (const spec of sizes) {
	await renderIcon(spec);
}

await renderFaviconIco();

const ogWidth = 1200;
const ogHeight = 630;
const ogLogo = await sharp(path.join(publicDir, "logo.png"))
	.resize(480, Math.round(480 * (135 / 748)), { fit: "inside" })
	.png()
	.toBuffer();

await sharp({
	create: {
		width: ogWidth,
		height: ogHeight,
		channels: 4,
		background: "#FAF9F7",
	},
})
	.composite([{ input: ogLogo, gravity: "centre" }])
	.png()
	.toFile(path.join(publicDir, "opengraph-image.png"));

console.log("wrote opengraph-image.png");
