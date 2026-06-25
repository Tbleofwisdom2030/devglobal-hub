import { Card } from '@devglobal/ui';

export default function TermsPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using DevGlobal Hub, you agree to be bound by these Terms of Service. 
            If you do not agree, please do not use our platform.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">2. Account Registration</h2>
          <p className="text-muted-foreground mb-3">
            You must provide accurate, complete, and current information during registration. 
            You are responsible for maintaining the confidentiality of your account credentials.
          </p>
          <p className="text-muted-foreground">
            You must be at least 18 years old to create an account.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">3. Software Licenses</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>Each purchase grants you a non-exclusive, non-transferable license to use the software.</p>
            <p>License keys are for individual use and should not be shared.</p>
            <p>Each license allows activation on up to 3 devices.</p>
            <p>We reserve the right to revoke licenses for Terms of Service violations.</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">4. Payments and Refunds</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>All prices are in USD unless otherwise stated.</p>
            <p>Payments are processed securely through Stripe.</p>
            <p>Refund requests are evaluated on a case-by-case basis within 30 days of purchase.</p>
            <p>Chargebacks may result in license revocation.</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
          <p className="text-muted-foreground mb-3">You agree not to:</p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>Reverse engineer or decompile our software</li>
            <li>Share or resell license keys</li>
            <li>Use the platform for illegal activities</li>
            <li>Attempt to bypass security measures</li>
            <li>Upload malicious code or content</li>
            <li>Harass or abuse other users</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            DevGlobal Hub is provided "as is" without warranties. We are not liable for any 
            damages arising from the use of our platform. Our liability is limited to the 
            amount you paid for the service.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
          <p className="text-muted-foreground">
            For questions about these Terms, contact us at{' '}
            <a href="mailto:legal@devglobalhub.com" className="text-primary hover:underline">
              legal@devglobalhub.com
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}