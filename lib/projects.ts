export type Project = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  status?: "live" | "wip";
  link?: string;
  github?: string;
};

export const featuredProjects: Project[] = [
  {
    slug: "get-mirror",
    title: "GET MIRROR – Teacher–Student LMS & Notice Board",
    description:
      "Full-stack platform for teachers and students with real-time notices, auth, roles, and deployment on a cloud server with Nginx and PM2.",
    tech: [
      "Next.js",
      "Node.js",
      "Express",
      "MongoDB",
      "Sockets",
      "Nginx",
      "PM2",
    ],
    status: "wip",
  },
  {
    slug: "chat-app",
    title: "One-to-one Chat App",
    description:
      "Phone-number based chat app with backend-first design, focusing on clean API design, auth, and real-time messaging.",
    tech: ["Node.js", "MongoDB", "Socket.io", "React/React Native"],
  },
];

export const allProjects: Project[] = [
  ...featuredProjects,
  {
    slug: "ios-shopping",
    title: "iOS Shopping App",
    description:
      "Swift-based shopping UI built from a course, extended with real-world patterns and clean navigation.",
    tech: ["Swift", "UIKit", "Storyboard / SwiftUI"],
  },
  {
    slug: "android-auth",
    title: "Android Auth App",
    description:
      "Jetpack Compose authentication app with Firebase backend, ViewModel, Hilt and clean architecture.",
    tech: ["Kotlin", "Jetpack Compose", "Firebase", "Hilt"],
  },
];
