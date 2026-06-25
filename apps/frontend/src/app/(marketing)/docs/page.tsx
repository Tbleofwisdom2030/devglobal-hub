'use client';

import Link from 'next/link';
import { Card } from '@devglobal/ui';
import { 
  BookOpen, 
  Code2, 
  Key, 
  ShoppingCart, 
  MessageSquare, 
  Bot,
  Rocket,
  Shield,
  ArrowRight
} from 'lucide-react';

const docSections = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Learn the basics and set up your DevGlobal Hub account',
    links: [
      { title: 'Quick Start Guide', href: '/docs/quickstart' },
      { title: 'Creating Your Account', href: '/docs/account-setup' },
      { title: 'Platform Overview', href: '/docs/platform-overview' },
    ],
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-950',
  },
  {
    icon: Code2,
    title: 'Developer API',
    description: 'Integrate DevGlobal Hub with your applications',
    links: [
      { title: 'API Reference', href: '/api' },
      { title: 'Authentication', href: '/docs/api-auth' },
      { title: 'Webhooks', href: '/docs/webhooks' },
    ],
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-950',
  },
  {
    icon: Key,
    title: 'License Management',
    description: 'Generate, validate, and manage software licenses',
    links: [
      { title: 'License Key Generation', href: '/docs/license-generation' },
      { title: 'License Validation API', href: '/docs/license-validation' },
      { title: 'Activation Tracking', href: '/docs/activation-tracking' },
    ],
    color: 'text-green-600 bg-green-100 dark:bg-green-950',
  },
  {
    icon: ShoppingCart,
    title: 'Products & Orders',
    description: 'Manage your product listings and process orders',
    links: [
      { title: 'Creating Products', href: '/docs/creating-products' },
      { title: 'Pricing Strategies', href: '/docs/pricing' },
      { title: 'Order Management', href: '/docs/order-management' },
    ],
    color: 'text-orange-600 bg-orange-100 dark:bg-orange-950',
  },
  {
    icon: Bot,
    title: 'AI Features',
    description: 'Leverage AI-powered tools for support and insights',
    links: [
      { title: 'DevBot AI Assistant', href: '/docs/devbot' },
      { title: 'AI Ticket Analysis', href: '/docs/ai-tickets' },
      { title: 'Knowledge Base RAG', href: '/docs/rag-pipeline' },
    ],
    color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950',
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Learn about our security practices and compliance',
    links: [
      { title: 'Security Overview', href: '/docs/security' },
      { title: 'Data Privacy', href: '/docs/privacy' },
      { title: 'Compliance', href: '/docs/compliance' },
    ],
    color: 'text-red-600 bg-red-100 dark:bg-red-950',
  },
];

export default function DocumentationPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to know about using DevGlobal Hub to build, sell, 
          and support your software products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className={`h-12 w-12 rounded-lg ${section.color} flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                      {link.title}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}