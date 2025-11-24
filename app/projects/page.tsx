import ProjectCategory from "@/components/ProjectCategory";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Projects</h1>

      <ProjectCategory title="Web Projects" items={projects.web} />
      <ProjectCategory title="iOS Projects" items={projects.ios} />
      <ProjectCategory title="Android Projects" items={projects.android} />
    </main>
  );
}
