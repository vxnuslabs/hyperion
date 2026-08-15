import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-20 font-mono text-sm leading-relaxed">
      <header className="mb-16">
        <h1 className="text-2xl font-bold tracking-tight text-accent mb-2">HYPERION</h1>
        <p className="text-muted">by VXNUS</p>
      </header>

      <section className="mb-16">
        <p className="mb-6">
          A local-first interface for interacting with AI models through OpenRouter.
        </p>

        <ul className="space-y-4 text-muted">
          <li className="flex gap-4">
            <span className="text-foreground whitespace-nowrap">BYOK</span>
            <span>Bring your own OpenRouter API key. Runtime only.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-foreground whitespace-nowrap">NO DATABASE</span>
            <span>Hyperion does not maintain a server-side conversation store.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-foreground whitespace-nowrap">FRESH SESSIONS</span>
            <span>No cross-session memory. Each chat is a blank slate.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-foreground whitespace-nowrap">MODEL ACCESS</span>
            <span>Search and select models available through OpenRouter.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-foreground whitespace-nowrap">EXPORT</span>
            <span>Save the current transcript locally as JSON.</span>
          </li>
        </ul>
      </section>

      <div className="mb-24">
        <Link 
          href="/chat" 
          className="inline-block border border-border px-6 py-3 hover:bg-surface hover:border-muted transition-colors text-accent uppercase tracking-widest text-xs font-bold"
        >
          Initialize Console
        </Link>
      </div>

      <footer className="mt-auto pt-8 border-t border-border/50 flex flex-wrap gap-6 text-xs text-muted">
        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
        <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">OpenRouter</a>
        <a href="https://vxnus.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">VXNUS</a>
      </footer>
    </main>
  );
}
