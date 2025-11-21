export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/60">
      <div className="max-w-5xl mx-auto px-4 py-6 text-xs text-zinc-500 flex justify-between">
        <span>© {new Date().getFullYear()} Kishan Rana Ghosh</span>
        <span>Built with Next.js, Tailwind, Gemini & a lot of chai ☕</span>
      </div>
    </footer>
  );
}
