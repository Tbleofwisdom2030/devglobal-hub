import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  // Update all products to remove broken image URLs
  await p.product.updateMany({
    data: {
      imageUrls: [],
      coverImage: null,
    }
  });
  const products = await p.product.findMany();
  console.log("Updated", products.length, "products");
  products.forEach(x => console.log(" -", x.name));
  await p.$disconnect();
}
main();
