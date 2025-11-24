import ProjectCard from "./ProjectCard";

export default function ProjectCategory({ title, items }: any) {
  return (
    <section className="mt-10">
      <h2 className="text-3xl font-bold mb-5">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((project: any, i: number) => (
          <ProjectCard project={project} key={i} />
        ))}
      </div>
    </section>
  );
}
