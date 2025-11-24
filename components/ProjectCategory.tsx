"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function ProjectCategory({ title, items }: any) {
  return (
    <section className="mt-14 ">
      <h2 className="text-3xl font-bold mb-5">{title}</h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: "-100px", once: false, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {items.map((project: any, index: number) => (
          <motion.div
            key={index}
            variants={{
              hidden: {
                opacity: 0,
                x: index % 2 === 0 ? -40 : 40,
                y: 20,
              },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                },
              },
              exit: {
                opacity: 0,
                x: index % 2 === 0 ? -40 : 40,
                y: 20,
              },
            }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
