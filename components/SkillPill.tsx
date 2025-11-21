export default function SkillPill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-100">
      {label}
    </span>
  );
}
