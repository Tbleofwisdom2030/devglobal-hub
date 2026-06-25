import { PrismaClient } from "./node_modules/@prisma/client";
const p = new PrismaClient();
async function main() {
  try {
    const c = await p.product.create({
      data: {
        name: "TSX Direct Test",
        slug: "tsx-direct-" + Date.now(),
        priceCents: 999,
        currency: "USD",
        isActive: true,
      }
    });
    console.log("CREATED:", c.id, c.name);
    
    const all = await p.product.findMany();
    console.log("Total products:", all.length);
    all.forEach(x => console.log(" -", x.name, x.slug));
  } catch(e) {
    console.error("ERROR:", e.message);
  }
  await p.$disconnect();
}
main();
