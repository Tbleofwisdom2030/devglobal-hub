import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-xl">DG</span>
            </div>
            <span className="text-2xl font-bold">DevGlobal Hub</span>
          </Link>
          <h2 className="text-4xl font-bold mb-6">
            Build, Sell, and Support Your Software
          </h2>
          <p className="text-lg text-indigo-100">
            Join thousands of developers who trust DevGlobal Hub for software
            distribution, license management, and AI-powered customer support.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-indigo-200 text-sm">Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-indigo-200 text-sm">Licenses</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-indigo-200 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}