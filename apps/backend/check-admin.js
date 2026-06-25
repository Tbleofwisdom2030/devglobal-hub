const { PrismaClient } = require('@prisma/client');

async function check() {
  const p = new PrismaClient();
  const u = await p.user.findUnique({ where: { email: 'admin@devglobalhub.com' } });
  console.log('User found:', !!u);
  console.log('Hash exists:', !!u?.passwordHash);
  console.log('Hash preview:', u?.passwordHash?.substring(0, 30));
  await p.$disconnect();
}

check();