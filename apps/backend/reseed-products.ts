import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  // Delete all existing products and re-seed with working image URLs
  await p.product.deleteMany();
  
  const products = [
    {
      name: "DevFlow Pro",
      slug: "devflow-pro",
      description: "Advanced workflow automation tool for developers",
      longDescription: "DevFlow Pro streamlines your development workflow with intelligent automation, CI/CD integration, and real-time collaboration features.",
      priceCents: 4999,
      currency: "USD",
      category: "Developer Tools",
      tags: ["automation", "workflow", "devops", "ci-cd"],
      imageUrls: ["https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=400&fit=crop"],
      coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=600&fit=crop",
      version: "2.1.0",
      isActive: true,
    },
    {
      name: "CodeScope AI",
      slug: "codescope-ai",
      description: "AI-powered code analysis and optimization tool",
      longDescription: "CodeScope AI uses advanced machine learning to analyze your codebase, identify optimization opportunities, and suggest improvements.",
      priceCents: 7999,
      currency: "USD",
      category: "AI Tools",
      tags: ["ai", "code-analysis", "optimization", "machine-learning"],
      imageUrls: ["https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop"],
      coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=600&fit=crop",
      version: "1.5.0",
      isActive: true,
    },
    {
      name: "DeployMate",
      slug: "deploymate",
      description: "One-click deployment management platform",
      longDescription: "DeployMate simplifies your deployment process with one-click deployments, rollback capabilities, and comprehensive monitoring.",
      priceCents: 2999,
      currency: "USD",
      category: "DevOps",
      tags: ["deployment", "devops", "cloud", "monitoring"],
      imageUrls: ["https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop"],
      coverImage: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=600&fit=crop",
      version: "3.0.0",
      isActive: true,
    },
  ];

  for (const prod of products) {
    const created = await p.product.create({ data: prod });
    console.log("Created:", created.name, "-", created.imageUrls[0]);
  }
  
  const total = await p.product.count();
  console.log("\nTotal products:", total);
  await p.$disconnect();
}
main();
