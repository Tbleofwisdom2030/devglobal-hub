'use client';

import { useState } from 'react';
import { Button, Card, Input } from '@devglobal/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@devglobal/ui';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send,
  MessageSquare,
  HelpCircle,
  Loader2
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'support@devglobalhub.com',
    description: 'We respond within 24 hours',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    value: 'Available 24/7',
    description: 'AI-powered support + human agents',
  },
  {
    icon: MapPin,
    title: 'Office',
    value: 'San Francisco, CA',
    description: 'Remote-first company',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon-Fri, 9AM-6PM PST',
    description: 'Support available 24/7',
  },
];

const faqs = [
  {
    question: 'What is DevGlobal Hub?',
    answer: 'DevGlobal Hub is an all-in-one platform for independent developers to showcase, sell, and support their software products with AI-powered tools.',
  },
  {
    question: 'How does licensing work?',
    answer: 'When a customer purchases your product, a unique, cryptographically secure license key is generated automatically. Customers can activate their license on up to 3 devices.',
  },
  {
    question: 'Can I try before I buy?',
    answer: 'Yes! We offer a free trial for all our products. You can create an account and explore the platform before making a purchase.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and digital wallets through our secure Stripe payment processing.',
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: 'Message sent!',
      description: "We'll get back to you within 24 hours.",
      variant: 'success',
    });
    
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Have a question or need help? We're here for you.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {contactInfo.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-primary font-medium text-sm mb-1">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Your name"
                    error={errors.name?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="your@email.com"
                    error={errors.email?.message}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a category</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('subject')}
                  placeholder="What's this about?"
                  error={errors.subject?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>

        {/* FAQ Sidebar */}
        <div>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Quick Answers</h3>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
                  <p className="text-xs text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}