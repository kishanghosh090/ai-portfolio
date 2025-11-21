export default function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="max-w-5xl mx-auto px-4 py-12 md:py-16 space-y-4"
    >
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300/80">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
