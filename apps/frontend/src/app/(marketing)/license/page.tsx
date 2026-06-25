'use client';

import { Card } from '@devglobal/ui';

export default function LicenseAgreementPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">License Agreement</h1>
      <p className="text-muted-foreground mb-8">Version 2.0 - Effective January 1, 2024</p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">End User License Agreement (EULA)</h2>
          <p className="text-muted-foreground">
            This End User License Agreement governs your use of software products purchased 
            through DevGlobal Hub. By installing or using the software, you agree to these terms.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">1. Grant of License</h2>
          <p className="text-muted-foreground">
            Upon purchase, you are granted a non-exclusive, non-transferable, limited license 
            to install and use the software on up to three (3) devices for your personal or 
            business use.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">2. License Term</h2>
          <div className="space-y-3 text-muted-foreground">
            <p><strong>Perpetual License:</strong> Valid indefinitely for the purchased version.</p>
            <p><strong>Maintenance Period:</strong> Includes 12 months of updates and support.</p>
            <p><strong>Renewal:</strong> Optional maintenance renewal at 50% of current license price.</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">3. Restrictions</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>You may not redistribute, resell, or sublicense the software</li>
            <li>You may not modify, decompile, or reverse engineer the software</li>
            <li>You may not use the software for illegal purposes</li>
            <li>You may not remove or alter any proprietary notices</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">4. Ownership</h2>
          <p className="text-muted-foreground">
            The software is licensed, not sold. All intellectual property rights remain with 
            the software developer. This license does not grant you any ownership rights.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">5. Termination</h2>
          <p className="text-muted-foreground">
            This license is effective until terminated. It will terminate automatically if you 
            fail to comply with any terms. Upon termination, you must destroy all copies of 
            the software.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">6. Warranty Disclaimer</h2>
          <p className="text-muted-foreground">
            The software is provided &quot;as is&quot; without warranty of any kind. The developer does 
            not warrant that the software will meet your requirements or that operation will 
            be uninterrupted or error-free.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
          <p className="text-muted-foreground">
            For questions about this License Agreement, contact us at{' '}
            <a href="mailto:legal@devglobalhub.com" className="text-primary hover:underline">
              legal@devglobalhub.com
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}