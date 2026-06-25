const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const r = await p.media.deleteMany();
  console.log('Deleted ' + r.count + ' records');
  await p.();
}
main();
