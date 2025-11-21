import Hero from "@/components/Hero";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { featuredProjects } from "@/lib/projects";
import TimelineItem from "@/components/TimelineItem";
import { timeline } from "@/lib/timeline";

export default function Home() {
  return (
    <>
      <Hero />

      <Section id="about" title="About me" eyebrow="Intro">
        <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-3xl">
          I&apos;m a developer who enjoys understanding the full stack — from
          frontend UX to backend systems, mobile apps, and even a bit of
          infrastructure. While pursuing my BS in Data Science from IIT Madras
          and BSc in CS, I&apos;ve been building projects that feel like real
          products, not just assignments.
        </p>
      </Section>

      <Section
        id="projects"
        title="Highlighted projects"
        eyebrow="Things I've shipped"
      >
        <div className="grid md:grid-cols-2 gap-5">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>

      <Section
        id="timeline"
        title="Journey so far"
        eyebrow="Learning timeline"
      >
        <div className="space-y-4">
          {timeline.map((item) => (
            <TimelineItem key={item.title} item={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
