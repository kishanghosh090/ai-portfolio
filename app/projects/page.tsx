import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { allProjects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <Section title="All projects" eyebrow="Work">
      <div className="grid md:grid-cols-2 gap-5">
        {allProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </Section>
  );
}
