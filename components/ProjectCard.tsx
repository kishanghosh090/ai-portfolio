import LiquidGlassCard from "./LiquidGlassCard";

export default function ProjectCard({ project }: any) {
  return (
    <LiquidGlassCard>
      <h3 className="text-xl font-semibold">{project.title}</h3>

      <p className="text-zinc-300 text-sm mt-1">
        {project.description}
      </p>

      <div className="flex gap-2 flex-wrap mt-3">
        {project.tech.map((t: string) => (
          <span
            key={t}
            className="text-xs px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            {t}
          </span>
        ))}
      </div>

      <a
        href={project.link}
        className="inline-block mt-4 text-sm text-blue-300 underline"
      >
        View Details →
      </a>
    </LiquidGlassCard>
  );
}
