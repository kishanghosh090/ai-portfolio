import Hero from "@/components/Hero";
import Section from "@/components/Section";
import TimelineItem from "@/components/TimelineItem";
import { timeline } from "@/lib/timeline";
import { projects } from "@/data/projects";
import ProjectCategory from "@/components/ProjectCategory";
import SiriFluid from "@/components/SiriFluid";

export default function Home() {
  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <Hero />
      {/* <SiriFluid active={true} /> */}

      <Section id="about" title="About me" eyebrow="Intro">
        <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-3xl">
          I&apos;m a developer who enjoys understanding the full stack — from
          frontend UX to backend systems, mobile apps, and even a bit of
          infrastructure. While pursuing my BS in Data Science from IIT Madras
          and BSc in CS, I&apos;ve been building projects that feel like real
          products, not just assignments.
        </p>
      </Section>

      <Section id="projects" title="My Projects" eyebrow="Things I've shipped">
        {Object.entries(projects).map(([category, items]) => (
          <ProjectCategory
            key={category}
            title={`${
              category.charAt(0).toUpperCase() + category.slice(1)
            } Projects`}
            items={items}
          />
        ))}
      </Section>

      <Section id="timeline" title="Journey so far" eyebrow="Learning timeline">
        <div className="space-y-4">
          {timeline.map((item) => (
            <TimelineItem key={item.title} item={item} />
          ))}
        </div>
      </Section>
    </div>
  );
}
