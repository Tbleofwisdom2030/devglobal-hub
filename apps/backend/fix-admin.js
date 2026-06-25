const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function fixAdmin() {
  console.log('Fixing admin user...\n');

  // First, check what's in the database
  const existingUsers = await prisma.user.findMany();
  console.log('Existing users:', existingUsers.length);
  existingUsers.forEach(u => {
    console.log('  -', u.email, '| hash:', u.passwordHash ? u.passwordHash.substring(0, 30) + '...' : 'NULL');
  });

  // Create proper bcrypt hash
  const hash = await bcrypt.hash('Admin@123!', 12);
  console.log('\nGenerated hash:', hash.substring(0, 30) + '...');

  // Delete old admin if exists
  await prisma.user.deleteMany({ where: { email: 'admin@devglobalhub.com' } });
  console.log('Deleted old admin user (if existed)');

  // Create fresh admin with proper hash
  const admin = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin@devglobalhub.com',
      passwordHash: hash,
      fullName: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log('Created admin:', admin.email);
  console.log('   Password hash:', admin.passwordHash.substring(0, 30) + '...');

  // VERIFY the password works
  const isValid = await bcrypt.compare('Admin@123!', admin.passwordHash);
  console.log('\nPassword verification test:', isValid ? 'PASSED' : 'FAILED');

  if (!isValid) {
    console.error('Password verification failed! Something is wrong with bcrypt.');
  } else {
    console.log('\nAdmin user is ready! You can now login with:');
    console.log('   Email: admin@devglobalhub.com');
    console.log('   Password: Admin@123!');
  }

  await prisma.$disconnect();
}

fixAdmin().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});