import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-20 font-mono text-sm leading-relaxed">
      <header className="mb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-accent mb-2 uppercase">Privacy Information</h1>
        <p className="text-muted">Effective Date: 2026-08-15</p>
      </header>

      <section className="mb-12 space-y-8">
        <div>
          <h2 className="text-foreground font-bold mb-4 uppercase tracking-widest border-b border-border pb-2">1. What Hyperion Stores</h2>
          <p className="text-muted mb-4">
            Hyperion is a local-first interface. The actual implementation guarantees the following behaviors:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-2 text-muted">
            <li><strong className="text-foreground">No Server Database:</strong> Hyperion does not operate a server-side chat database. No conversations are uploaded to or stored by Hyperion.</li>
            <li><strong className="text-foreground">No Account System:</strong> There is no user account system within Hyperion.</li>
            <li><strong className="text-foreground">API Key Lifecycle:</strong> The OpenRouter API key you provide is runtime-only. It is kept strictly in memory while the application is open. It is not persisted to localStorage, IndexedDB, or cookies. Closing or reloading the tab discards the key.</li>
            <li><strong className="text-foreground">Chat History:</strong> Chat history is not automatically persisted locally. Each session is fresh, and cross-session memory does not exist.</li>
            <li><strong className="text-foreground">System Prompt Presets:</strong> If you choose to save system prompt presets, those presets are stored strictly locally in your browser&apos;s `localStorage`.</li>
            <li><strong className="text-foreground">Exports:</strong> Conversation exports are generated locally by your browser. No server is involved in creating the JSON file.</li>
          </ul>
          <div className="mt-6 bg-surface border border-border p-4 text-xs">
            <strong className="text-foreground block mb-1">Security & Isolation Recommendation</strong>
            While your browser will always carry inherent risks when holding credentials in memory, we strongly recommend cloning the open-source repository and running Hyperion locally so you have full control over the deployment rather than relying on any publicly hosted version.
          </div>
        </div>

        <div>
          <h2 className="text-foreground font-bold mb-4 uppercase tracking-widest border-b border-border pb-2">2. What Leaves the Browser</h2>
          <p className="text-muted mb-4">
            When you send a message, the request travels directly:
          </p>
          <div className="bg-surface border border-border p-4 mb-4 text-center font-bold text-accent">
            Browser → OpenRouter → Selected Model Provider
          </div>
          <p className="text-muted">
            Hyperion itself is not the AI model provider. We merely provide the interface that constructs the API request to OpenRouter.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-bold mb-4 uppercase tracking-widest border-b border-border pb-2">3. Third Parties</h2>
          <p className="text-muted mb-4">
            Hyperion acts as a client for OpenRouter. When you use Hyperion, your prompts and chat history within that specific session are transmitted to OpenRouter.
          </p>
          <p className="text-muted">
            OpenRouter&apos;s retention policies, data usage, and the policies of the underlying model providers apply. Please review OpenRouter&apos;s current policies at <a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">openrouter.ai/privacy</a>.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-bold mb-4 uppercase tracking-widest border-b border-border pb-2">4. Erasing Local Data</h2>
          <p className="text-muted mb-4">
            Because Hyperion relies almost entirely on runtime memory, you can erase most of its state simply by closing or refreshing the page.
          </p>
          <p className="text-muted">
            If you have saved system prompt presets, you can delete them individually within the application settings, or you can clear your browser&apos;s site data (localStorage) for this domain to remove all saved presets instantly.
          </p>
          <p className="text-accent mt-4">
            Note: Deleting local Hyperion data does not erase information that has already been transmitted to OpenRouter or the model providers.
          </p>
        </div>
      </section>
    </main>
  );
}
