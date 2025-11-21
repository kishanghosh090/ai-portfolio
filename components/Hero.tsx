import VoiceButton from "./VoiceButton";

export default function Hero() {
  return (
    <div className="relative overflow-hidden border-b border-white/5">
      {/* Background gradient blob */}
      <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.35),transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.25),transparent_55%)] opacity-80" />

      <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-10 items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-200/80">
            Full-stack • Mobile • AI • DSA
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Hey, I&apos;m{" "}
            <span className="text-violet-300">Kishan Rana Ghosh</span>.
            <br className="hidden md:block" /> I ship ambitious products
            end-to-end.
          </h1>
          <p className="text-sm md:text-base text-zinc-300 max-w-xl">
            First-year BS Data Science + BSc CS student, building real-world
            apps across web, Android, iOS and AI. From teacher-student platforms
            to voice-driven experiences — I love turning complex ideas into
            working systems.
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {[
              "Next.js & Node.js",
              "Android (Kotlin, Compose)",
              "iOS (SwiftUI, UIKit)",
              "DSA (LeetCode grind)",
              "IIT Madras BS in DS",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <a
              href="#projects"
              className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
            >
              View projects
            </a>
            <a
              href="#contact"
              className="text-sm text-zinc-300 hover:text-white"
            >
              Contact me →
            </a>
          </div>
        </div>

        {/* Right side: AI assistant card */}
        {/* <div className="relative">
          <div className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-5 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            <p className="text-xs text-zinc-400 mb-4">
              Talk to my portfolio assistant. Ask about my projects, skills, or
              DSA progress — it knows my routes.
            </p>
            <div className="flex items-center justify-center py-4">
              <VoiceButton />
            </div>
            <p className="mt-3 text-[11px] text-zinc-500">
              Try saying:{" "}
              <span className="text-zinc-300">
                &quot;Show me your Android projects&quot;
              </span>{" "}
              or{" "}
              <span className="text-zinc-300">
                &quot;Open your DSA journey&quot;
              </span>
              .
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
