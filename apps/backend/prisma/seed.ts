// import bcryptjs from 'bcryptjs';
// import { v4 as uuidv4 } from 'uuid';
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Seeding database...');

//   // Clean existing data
//   await prisma.auditLog.deleteMany();
//   await prisma.chatMessage.deleteMany();
//   await prisma.chatConversation.deleteMany();
//   await prisma.ticketMessage.deleteMany();
//   await prisma.supportTicket.deleteMany();
//   await prisma.kbEmbedding.deleteMany();
//   await prisma.knowledgeBase.deleteMany();
//   await prisma.license.deleteMany();
//   await prisma.order.deleteMany();
//   await prisma.refreshToken.deleteMany();
//   await prisma.product.deleteMany();
//   await prisma.user.deleteMany();

//   // Create Admin User
//   const adminPassword = await bcryptjs.hash('Admin@123!', 12);
//   const admin = await prisma.user.create({
//     data: {
//       id: uuidv4(),
//       email: 'admin@devglobalhub.com',
//       passwordHash: adminPassword,
//       fullName: 'Admin User',
//       role: 'ADMIN',
//       emailVerified: true,
//     },
//   });
//   console.log('✅ Admin user created:', admin.email);

//   // Create Support User
//   const supportPassword = await bcryptjs.hash('Support@123!', 12);
//   const support = await prisma.user.create({
//     data: {
//       id: uuidv4(),
//       email: 'support@devglobalhub.com',
//       passwordHash: supportPassword,
//       fullName: 'Support Agent',
//       role: 'SUPPORT',
//       emailVerified: true,
//     },
//   });
//   console.log('✅ Support user created:', support.email);

//   // Create Demo Customer
//   const customerPassword = await bcryptjs.hash('Customer@123!', 12);
//   const customer = await prisma.user.create({
//     data: {
//       id: uuidv4(),
//       email: 'customer@example.com',
//       passwordHash: customerPassword,
//       fullName: 'Demo Customer',
//       role: 'CUSTOMER',
//       emailVerified: true,
//     },
//   });
//   console.log('✅ Customer user created:', customer.email);

//   // Create Products
//   const products = [
//     {
//       id: uuidv4(),
//       slug: 'devflow-pro',
//       name: 'DevFlow Pro',
//       description: 'Advanced workflow automation tool for developers',
//       longDescription: 'DevFlow Pro streamlines your development workflow with intelligent automation, CI/CD integration, and real-time collaboration features.',
//       priceCents: 4999,
//       category: 'Developer Tools',
//       tags: ['automation', 'workflow', 'devops', 'ci-cd'],
//       imageUrls: ['https://cdn.devglobalhub.com/products/devflow-pro.png'],
//       version: '2.1.0',
//       isActive: true,
//     },
//     {
//       id: uuidv4(),
//       slug: 'codescope-ai',
//       name: 'CodeScope AI',
//       description: 'AI-powered code analysis and optimization tool',
//       longDescription: 'CodeScope AI uses advanced machine learning to analyze your codebase, identify optimization opportunities, and suggest improvements.',
//       priceCents: 7999,
//       category: 'AI Tools',
//       tags: ['ai', 'code-analysis', 'optimization', 'machine-learning'],
//       imageUrls: ['https://cdn.devglobalhub.com/products/codescope-ai.png'],
//       version: '1.5.0',
//       isActive: true,
//     },
//     {
//       id: uuidv4(),
//       slug: 'deploymate',
//       name: 'DeployMate',
//       description: 'One-click deployment management platform',
//       longDescription: 'DeployMate simplifies your deployment process with one-click deployments, rollback capabilities, and comprehensive monitoring.',
//       priceCents: 2999,
//       category: 'DevOps',
//       tags: ['deployment', 'devops', 'cloud', 'monitoring'],
//       imageUrls: ['https://cdn.devglobalhub.com/products/deploymate.png'],
//       version: '3.0.0',
//       isActive: true,
//     },
//   ];

//   for (const product of products) {
//     await prisma.product.create({ data: product });
//   }
//   console.log(`✅ ${products.length} products created`);

//   // Create Knowledge Base Articles
//   const articles = [
//     {
//       id: uuidv4(),
//       title: 'Getting Started with DevFlow Pro',
//       content: '# Getting Started with DevFlow Pro\n\nWelcome to DevFlow Pro! This guide will help you get started with our advanced workflow automation tool.\n\n## Installation\n\n1. Download the installer from your account dashboard\n2. Run the installer and follow the setup wizard\n3. Activate your license using the key provided\n\n## First Workflow\n\nLet\'s create your first automated workflow...',
//       contentType: 'DOCUMENTATION',
//       tags: ['getting-started', 'devflow-pro', 'tutorial'],
//       slug: 'getting-started-devflow-pro',
//       isPublished: true,
//     },
//     {
//       id: uuidv4(),
//       title: 'CodeScope AI Best Practices',
//       content: '# CodeScope AI Best Practices\n\nOptimize your code analysis with these best practices.\n\n## Configuration\n\nProperly configure your analysis settings for maximum benefit...',
//       contentType: 'DOCUMENTATION',
//       tags: ['best-practices', 'codescope-ai', 'configuration'],
//       slug: 'codescope-ai-best-practices',
//       isPublished: true,
//     },
//     {
//       id: uuidv4(),
//       title: 'Common Deployment Issues',
//       content: '# Common Deployment Issues\n\nHere are solutions to common deployment problems.\n\n## Issue 1: Failed Deployments\n\nIf your deployment fails, check the following...',
//       contentType: 'FAQ',
//       tags: ['troubleshooting', 'deployment', 'faq'],
//       slug: 'common-deployment-issues',
//       isPublished: true,
//     },
//   ];

//   for (const article of articles) {
//     await prisma.knowledgeBase.create({ data: article });
//   }
//   console.log(`✅ ${articles.length} knowledge base articles created`);

//   // Create Sample Ticket
//   const ticket = await prisma.supportTicket.create({
//     data: {
//       id: uuidv4(),
//       userId: customer.id,
//       productId: products[0].id,
//       subject: 'Unable to activate license on new machine',
//       status: 'OPEN',
//       priority: 'MEDIUM',
//       category: 'Licensing',
//     },
//   });

//   await prisma.ticketMessage.create({
//     data: {
//       id: uuidv4(),
//       ticketId: ticket.id,
//       senderId: customer.id,
//       senderType: 'CUSTOMER',
//       content: 'Hi, I recently purchased a new computer and I\'m unable to activate my DevFlow Pro license. I keep getting an error that says "Maximum activations reached". Can you help me resolve this?',
//     },
//   });

//   console.log('✅ Sample ticket created');
//   console.log('');
//   console.log('🎉 Database seeding complete!');
//   console.log('');
//   console.log('📧 Login credentials:');
//   console.log('   Admin:    admin@devglobalhub.com / Admin@123!');
//   console.log('   Support:  support@devglobalhub.com / Support@123!');
//   console.log('   Customer: customer@example.com / Customer@123!');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed error:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.ticketMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.knowledgeBase.deleteMany();
  await prisma.license.deleteMany();
  await prisma.order.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const adminPassword = await bcryptjs.hash('Admin@123!', 12);
  const admin = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin@devglobalhub.com',
      passwordHash: adminPassword,
      fullName: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Support User
  const supportPassword = await bcryptjs.hash('Support@123!', 12);
  const support = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'support@devglobalhub.com',
      passwordHash: supportPassword,
      fullName: 'Support Agent',
      role: 'SUPPORT',
      emailVerified: true,
    },
  });
  console.log('✅ Support user created:', support.email);

  // Create Demo Customer
  const customerPassword = await bcryptjs.hash('Customer@123!', 12);
  const customer = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'customer@example.com',
      passwordHash: customerPassword,
      fullName: 'Demo Customer',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // Create Products
  const products = [
    {
      id: uuidv4(),
      slug: 'devflow-pro',
      name: 'DevFlow Pro',
      description: 'Advanced workflow automation tool for developers',
      longDescription: 'DevFlow Pro streamlines your development workflow with intelligent automation, CI/CD integration, and real-time collaboration features.',
      priceCents: 4999,
      category: 'Developer Tools',
      tags: ['automation', 'workflow', 'devops', 'ci-cd'],
      imageUrls: ['https://cdn.devglobalhub.com/products/devflow-pro.png'],
      version: '2.1.0',
      isActive: true,
    },
    {
      id: uuidv4(),
      slug: 'codescope-ai',
      name: 'CodeScope AI',
      description: 'AI-powered code analysis and optimization tool',
      longDescription: 'CodeScope AI uses advanced machine learning to analyze your codebase, identify optimization opportunities, and suggest improvements.',
      priceCents: 7999,
      category: 'AI Tools',
      tags: ['ai', 'code-analysis', 'optimization', 'machine-learning'],
      imageUrls: ['https://cdn.devglobalhub.com/products/codescope-ai.png'],
      version: '1.5.0',
      isActive: true,
    },
    {
      id: uuidv4(),
      slug: 'deploymate',
      name: 'DeployMate',
      description: 'One-click deployment management platform',
      longDescription: 'DeployMate simplifies your deployment process with one-click deployments, rollback capabilities, and comprehensive monitoring.',
      priceCents: 2999,
      category: 'DevOps',
      tags: ['deployment', 'devops', 'cloud', 'monitoring'],
      imageUrls: ['https://cdn.devglobalhub.com/products/deploymate.png'],
      version: '3.0.0',
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ ${products.length} products created`);

  // Create Knowledge Base Articles
  const articles = [
    {
      id: uuidv4(),
      title: 'Getting Started with DevFlow Pro',
      content: 'Welcome to DevFlow Pro! This guide helps you get started with installation and setup.',
      contentType: 'DOCUMENTATION' as const,
      tags: ['getting-started', 'devflow-pro'],
      slug: 'getting-started-devflow-pro',
      isPublished: true,
    },
    {
      id: uuidv4(),
      title: 'Common Deployment Issues',
      content: 'Here are solutions to common deployment problems.',
      contentType: 'FAQ' as const,
      tags: ['troubleshooting', 'deployment'],
      slug: 'common-deployment-issues',
      isPublished: true,
    },
  ];

  for (const article of articles) {
    await prisma.knowledgeBase.create({ data: article });
  }
  console.log(`✅ ${articles.length} knowledge base articles created`);

  // Create Sample Ticket
  const ticket = await prisma.supportTicket.create({
    data: {
      id: uuidv4(),
      userId: customer.id,
      productId: products[0].id,
      subject: 'Unable to activate license on new machine',
      status: 'OPEN',
      priority: 'MEDIUM',
      category: 'Licensing',
    },
  });

  await prisma.ticketMessage.create({
    data: {
      id: uuidv4(),
      ticketId: ticket.id,
      senderId: customer.id,
      senderType: 'CUSTOMER',
      content: 'Hi, I recently purchased a new computer and I am unable to activate my DevFlow Pro license. I keep getting an error that says "Maximum activations reached". Can you help me resolve this?',
    },
  });

  console.log('✅ Sample ticket created');
  console.log('');
  console.log('🎉 Database seeding complete!');
  console.log('');
  console.log('📧 Login credentials:');
  console.log('   Admin:    admin@devglobalhub.com / Admin@123!');
  console.log('   Support:  support@devglobalhub.com / Support@123!');
  console.log('   Customer: customer@example.com / Customer@123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });