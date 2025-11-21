import type { TimelineItemType } from "@/lib/timeline";

export default function TimelineItem({ item }: { item: TimelineItemType }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
      <div>
        <p className="text-xs text-violet-300">{item.period}</p>
        <h3 className="text-sm font-medium text-zinc-100">{item.title}</h3>
        <p className="text-xs text-zinc-300 max-w-xl">{item.description}</p>
      </div>
    </div>
  );
}
