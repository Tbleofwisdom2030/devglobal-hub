'use client';

import Link from 'next/link';
import { Button } from '@devglobal/ui';
import { 
  Users, 
  Target, 
  Heart, 
  Globe, 
  Zap,
  Shield,
  ArrowRight,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

const team = [
  {
    name: 'Alex Johnson',
    role: 'Founder & CEO',
    bio: 'Full-stack developer with 10+ years of experience building developer tools.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    bio: 'AI/ML expert passionate about making developer tools smarter.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Marcus Rivera',
    role: 'Head of Product',
    bio: 'Product leader focused on creating intuitive developer experiences.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Emily Watson',
    role: 'Lead Designer',
    bio: 'UX designer dedicated to making complex tools simple and beautiful.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Developer First',
    description: 'Everything we build starts with the developer experience in mind.',
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Your software and customer data are protected with enterprise-grade security.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We leverage cutting-edge AI to make software distribution smarter.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Serving developers and customers in over 150 countries worldwide.',
  },
];

const milestones = [
  { year: '2020', event: 'DevGlobal Hub founded with a vision to simplify software distribution' },
  { year: '2021', event: 'Launched first product, DevFlow Pro, reaching 1,000 developers' },
  { year: '2022', event: 'Introduced AI-powered support with DevBot assistant' },
  { year: '2023', event: 'Expanded to 50,000+ active licenses across three products' },
  { year: '2024', event: 'Launched CodeScope AI and reached 10,000+ developers worldwide' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-background dark:to-purple-950" />
        <div className="container relative py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DevGlobal Hub
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to empower independent developers with the tools they need 
            to build, distribute, and support world-class software.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe every developer deserves access to professional-grade tools for 
              distributing and supporting their software. DevGlobal Hub was created to 
              bridge the gap between indie developers and enterprise-level software 
              distribution platforms. With AI-powered features, we're making it easier 
              than ever to manage licenses, provide support, and grow your software business.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="max-w-2xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    {milestone.year.slice(2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-sm text-primary mb-1">{milestone.year}</p>
                  <p className="text-muted-foreground">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            A passionate team of developers, designers, and product thinkers building 
            the future of software distribution.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 inline-block">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-24 w-24 rounded-full object-cover mx-auto border-4 border-background shadow-lg group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Be part of a growing community of developers who trust DevGlobal Hub 
            for their software distribution needs.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100" asChild>
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}