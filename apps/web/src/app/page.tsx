/**
 * "/" — landing page placeholder
 * Phase 0: minimal so the app deploys cleanly.
 * Phase 1: replaced with the real landing page (Hero, HowItWorks, ContentTypePicker).
 */
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight">ContentLens</h1>
      <p className="text-gray-500 max-w-sm">
        AI content detector — coming soon.
      </p>
      <p className="text-xs text-gray-400">Phase 0 scaffold · nothing deployed yet</p>
    </main>
  );
}
