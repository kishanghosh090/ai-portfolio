import ProjectCategory from "@/components/ProjectCategory";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Projects</h1>


      {Object.entries(projects).map(([category, items]) => (
        <ProjectCategory
          key={category}
          title={`${category.charAt(0).toUpperCase() + category.slice(1)} Projects`}
          items={items}
        />
      ))}
    </main>
  );
}
