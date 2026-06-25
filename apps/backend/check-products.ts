import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  console.log('Total products in DB:', products.length);
  products.forEach(function(p) {
    console.log('  ' + p.name + ' (' + p.slug + ') - Active: ' + p.isActive);
  });
  await prisma.\();
}
main();
