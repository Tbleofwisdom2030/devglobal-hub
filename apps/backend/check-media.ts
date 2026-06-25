const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const media = await p.media.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
  media.forEach(function(m) {
    console.log('URL:', m.url);
  });
  await p.disconnect();
}
main();
