import { Card } from '@devglobal/ui';

export default function PrivacyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground">
            DevGlobal Hub ("we," "our," or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you use our platform.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">Account Information</h3>
              <p className="text-muted-foreground text-sm">
                Name, email address, password hash, and profile information when you create an account.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Usage Data</h3>
              <p className="text-muted-foreground text-sm">
                Pages visited, features used, and interactions with our platform.
              </p>
            </div>
            <div>
              <h3 className="font-medium">License Data</h3>
              <p className="text-muted-foreground text-sm">
                License keys, activation records, and validation history.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Payment Information</h3>
              <p className="text-muted-foreground text-sm">
                Processed securely through Stripe. We do not store full credit card details.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>To provide and maintain our services</li>
            <li>To process transactions and manage licenses</li>
            <li>To provide customer support</li>
            <li>To send important updates and notifications</li>
            <li>To improve our platform and develop new features</li>
            <li>To detect and prevent fraud and abuse</li>
            <li>To comply with legal obligations</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-muted-foreground">
            We implement industry-standard security measures including encryption at rest and in 
            transit, regular security audits, and access controls. However, no method of electronic 
            storage is 100% secure.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
          <p className="text-muted-foreground mb-3">
            You have the right to:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@devglobalhub.com" className="text-primary hover:underline">
              privacy@devglobalhub.com
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}