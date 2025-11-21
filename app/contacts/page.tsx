import Section from "@/components/Section";

export default function ContactPage() {
  return (
    <Section id="contact" title="Contact" eyebrow="Let’s talk">
      <div className="space-y-3 text-sm text-zinc-300">
        <p>
          I&apos;m open to internships, collabs, and interesting side projects
          around full-stack, Android/iOS, or AI tooling.
        </p>
        <ul className="space-y-1">
          <li>
            <span className="text-zinc-400">Email: </span>
            <a
              href="mailto:your-email@example.com"
              className="text-violet-300 hover:text-violet-200"
            >
              your-email@example.com
            </a>
          </li>
          <li>
            <span className="text-zinc-400">GitHub: </span>
            <a
              href="https://github.com/your-github"
              target="_blank"
              className="text-violet-300 hover:text-violet-200"
            >
              github.com/your-github
            </a>
          </li>
          <li>
            <span className="text-zinc-400">LinkedIn: </span>
            <a
              href="https://linkedin.com/in/your-linkedin"
              target="_blank"
              className="text-violet-300 hover:text-violet-200"
            >
              linkedin.com/in/your-linkedin
            </a>
          </li>
        </ul>
      </div>
    </Section>
  );
}
