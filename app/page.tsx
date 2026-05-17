import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "3-5 Second Settlement",
    desc: "Payments arrive on the Stellar network in seconds, not days.",
  },
  {
    icon: Shield,
    title: "Fees Under 1%",
    desc: "Keep 99%+ of your earnings. No hidden charges.",
  },
  {
    icon: Globe,
    title: "No Crypto Knowledge Needed",
    desc: "Just invoices, balances, and bank withdrawals. We handle the rest.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-green-600">AfriPay 💸</span>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Powered by Stellar Network
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Get paid globally.
          <br />
          <span className="text-green-600">Keep 99% of your earnings.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          AfriPay lets Nigerian freelancers receive international payments in minutes — not days —
          with fees under 1%. No crypto knowledge required.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-6 rounded-xl border border-gray-100 bg-gray-50">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} AfriPay · Built with ❤️ for Nigerian freelancers ·{" "}
          <a
            href="https://github.com/devUnixx/afripay"
            className="hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source
          </a>
        </p>
      </footer>
    </main>
  );
}
