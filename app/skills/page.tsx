import Section from "@/components/Section";
import SkillPill from "@/components/SkillPill";
import { skills } from "@/lib/skills";

export default function SkillsPage() {
  return (
    <Section title="Skills" eyebrow="What I work with">
      <div className="space-y-6">
        {Object.entries(skills).map(([group, list]) => (
          <div key={group} className="space-y-2">
            <h3 className="text-sm font-medium capitalize text-zinc-200">
              {group}
            </h3>
            <div className="flex flex-wrap gap-2">
              {list.map((s) => (
                <SkillPill key={s} label={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
