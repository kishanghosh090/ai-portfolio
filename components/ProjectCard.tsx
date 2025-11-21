import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 hover:border-violet-400/60 transition">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm md:text-base">{project.title}</h3>
        {project.status && (
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-zinc-300">
            {project.status === "live" ? "Live" : "Work in progress"}
          </span>
        )}
      </div>
      <p className="text-xs md:text-sm text-zinc-300">{project.description}</p>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-200"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-3 pt-2 text-[11px]">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            className="text-violet-300 hover:text-violet-200"
          >
            Live →
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            className="text-zinc-300 hover:text-zinc-100"
          >
            GitHub
          </a>
        )}
      </div>
    </article>
  );
}
