import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-20 font-mono text-sm leading-relaxed">
      <header className="mb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-accent mb-2 uppercase">Terms of Use</h1>
        <p className="text-muted">Effective Date: 2026-08-15</p>
      </header>

      <section className="mb-12 space-y-8">
        <div>
          <h2 className="text-foreground font-bold mb-4 uppercase tracking-widest border-b border-border pb-2">1. Nature of the Service</h2>
          <p className="text-muted mb-4 text-accent border border-accent/20 bg-accent/5 p-4">
            Hyperion is not a security product or security-focused AI platform. It is a local-first client interface for interacting with third-party AI services.
          </p>
          <p className="text-muted">
            By using Hyperion, you acknowledge that you are using a tool to interact with external APIs, specifically OpenRouter, and that Hyperion itself does not provide the AI intelligence, host the models, or secure the transit beyond standard HTTPS.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-bold mb-4 uppercase tracking-widest border-b border-border pb-2">2. User Responsibility</h2>
          <p className="text-muted mb-2">You are solely responsible for:</p>
          <ul className="list-disc list-outside pl-5 space-y-2 text-muted">
            <li>Maintaining the security of your OpenRouter API key.</li>
            <li>The content of the prompts and data you submit through the interface.</li>
            <li>Selecting the appropriate model and provider for your use case.</li>
            <li>Any API costs incurred on your OpenRouter account through the use of this interface.</li>
            <li>Complying with all applicable laws, regulations, and OpenRouter&apos;s terms of service.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-foreground font-bold mb-4 uppercase tracking-widest border-b border-border pb-2">3. OpenRouter Integration</h2>
          <p className="text-muted">
            Hyperion operates as an independent client for the OpenRouter API. We are not affiliated with, endorsed by, or operated by OpenRouter. Your use of OpenRouter&apos;s services through Hyperion is governed by OpenRouter&apos;s own Terms of Service.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-bold mb-4 uppercase tracking-widest border-b border-border pb-2">4. No Guarantees</h2>
          <p className="text-muted mb-2">
            Hyperion is provided &quot;AS IS&quot; without warranties of any kind. We do not guarantee:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-2 text-muted">
            <li>The accuracy, reliability, or safety of the model outputs.</li>
            <li>The continuous availability or uptime of the interface or external services.</li>
            <li>The retention or non-retention policies of third-party model providers.</li>
            <li>Uninterrupted service or error-free operation.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-foreground font-bold mb-4 uppercase tracking-widest border-b border-border pb-2">5. Assumption of Risk</h2>
          <p className="text-muted">
            Your use of external AI services, submission of sensitive information, and usage of API keys within this browser environment is entirely at your own risk. Hyperion and its creators shall not be held liable for any damages, data leaks, API overages, or consequences arising from the use of this interface.
          </p>
        </div>
      </section>
    </main>
  );
}
